import { Button, Toast, toaster } from "@kobalte/core";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

function PresentationNavigation(props: {
	slide: number;
	isPresenter: boolean;
}) {
	let webSocket: WebSocket | null = null;
	let id: number;
	const dev = true;

	const moveToPage = (page: number) => {
		navigate(`/slides/${page}`);
	};

	const followPresenter = (message: { urgency: string; slide: number }) => {
		if (message.urgency === "now") {
			moveToPage(message.slide);
		}
	};

	const showToast = () => {
		id = toaster.show((props) => (
			<Toast.Root
				toastId={props.toastId}
				class="flex flex-col items-center justify-between gap-2 rounded-md p-3 bg-ctp-mantle/50 dark:bg-ctp-surface0 text-ctp-text border border-ctp-crust shadow-md"
			>
				<div class="toast__content">
					<div>
						<Toast.Title class="toast__title">
							Event has been created
						</Toast.Title>
						<Toast.Description class="toast__description">
							Monday, January 3rd at 6:00pm
						</Toast.Description>
					</div>
					<Toast.CloseButton class="toast__close-button">
						x
					</Toast.CloseButton>
				</div>
				<Toast.ProgressTrack class="toast__progress-track">
					<Toast.ProgressFill class="toast__progress-fill" />
				</Toast.ProgressTrack>
			</Toast.Root>
		));
	};

	createEffect(() => {
		if (dev) return;
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
			<Button.Root onclick={showToast}>Toast</Button.Root>
			<Portal>
				<Toast.Region>
					<Toast.List class=" fixed top-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-screen-xl m-0 z-[9999] outline-none" />
				</Toast.Region>
			</Portal>
		</div>
	);
}

export default PresentationNavigation;
