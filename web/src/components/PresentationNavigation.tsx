import { Button, Toast, toaster } from "@kobalte/core";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import NaviagtionToast from "./NaviagtionToast";

const dev = true;
let webSocket: WebSocket | null = null;
let id: number;

export default function PresentationNavigation(props: {
	slide: number;
	isPresenter: boolean;
}) {
	const [toastShown, setToastShown] = createSignal(false);

	const moveToPage = (page: number) => {
		navigate(`/slides/${page}`);
	};

	const followPresenter = (message: { urgency: string; slide: number }) => {
		if (message.urgency === "now") {
			moveToPage(message.slide);
		} else if (!props.isPresenter) {
			showToast(message.slide);
		}
	};

	const showToast = (page: number) => {
		if (toastShown()) {
			updateToast(page);
			return;
		}
		id = toaster.show((props) => (
			<NaviagtionToast
				id={props.toastId}
				onAction={() => moveToPage(page)}
				onCleanup={closeToast}
				currentPage={page}
			/>
		));
		setToastShown(true);
	};

	const updateToast = (page: number) => {
		toaster.update(id, (props) => (
			<NaviagtionToast
				id={props.toastId}
				onAction={() => moveToPage(page)}
				onCleanup={closeToast}
				currentPage={page}
			/>
		));
		setToastShown(true);
	};

	const closeToast = () => {
		setToastShown(false);
	};

	const sendSlideUpdate = (ws: WebSocket) => {
		ws.send(JSON.stringify({ type: "slide", slide: props.slide }));
	};

	createEffect(() => {
		if (webSocket && props.isPresenter) {
			sendSlideUpdate(webSocket);
		}
	});

	createEffect(() => {
		if (dev || webSocket) return;
		console.log(webSocket);
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
			const data = JSON.parse(event.data as string);

			console.log(data);

			if ("type" in data && data.type === "slide") {
				followPresenter(data);
			}
		};
	});

	onCleanup(() => {
		setToastShown(false);
		toaster.clear();
	});

	return (
		<div class="text-red-500">
			<div>slide: {props.slide}</div>
			<div>{toastShown() ? "toast shown" : "toast not shown"}</div>
			<Button.Root onclick={() => showToast(props.slide)}>
				Toast
			</Button.Root>
			<Portal>
				<Toast.Region>
					<Toast.List class=" fixed top-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-screen-xl m-0 z-[9999] outline-none" />
				</Toast.Region>
			</Portal>
		</div>
	);
}
