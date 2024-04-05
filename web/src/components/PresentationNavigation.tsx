import { createEffect, createSignal } from "solid-js";

function PresentationNavigation(props: {
	slide: number;
	isPresenter: boolean;
}) {
	let webSocket: WebSocket | null = null;

	const moveToPage = (page: number) => {
		window.location.href = `/slides/${page}`;
	};

	const followPresenter = (message: { urgency: string; slide: number }) => {
		if (message.urgency === "now") {
			moveToPage(message.slide);
		}
	};

	createEffect(() => {
		if (webSocket) {
			webSocket.close();
		}
		webSocket = new WebSocket(
			"wss://unity-cf-relay.peculiarnewbie.workers.dev/api/room/hecc/websocket"
		);
		webSocket.onopen = () => {
			if (webSocket) {
				webSocket.send(
					JSON.stringify({ type: "join", slide: props.slide })
				);
			}
		};
		webSocket.onmessage = (event) => {
			const data = JSON.parse((event.data as string).slice(18));

			console.log(data);

			if ("type" in data && data.type === "slide") {
				followPresenter(data);
			}

			// if (data.type === "slide") {
			// 	setPage(data.slide);
			// }
		};
	});

	return (
		<div class="text-red-500">
			<div>slide: {props.slide}</div>
		</div>
	);
}

export default PresentationNavigation;
