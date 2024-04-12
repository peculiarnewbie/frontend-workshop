import { Button, Toast, toaster } from "@kobalte/core";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import NavigationToast from "./NavigationToast";

// const wsFlag = false;
let webSocket: WebSocket | null = null;
let id: number;

let slideTracker = {
	presenter: 1,
	client: 1,
};

export default function PresentationNavigation(props: {
	slide: number;
	isPresenter: boolean;
	wsUrl: string;
	wsFlag: boolean;
}) {
	const [toastShown, setToastShown] = createSignal(false);

	const moveToPage = (page: number) => {
		navigate(`/slides/${page}`);
	};

	// weird name this
	const followPresenter = (message: { urgency: string; slide: number }) => {
		if (props.isPresenter) return;
		const prevPresenter = slideTracker.presenter;
		slideTracker.presenter = message.slide;

		if (
			message.urgency === "now" ||
			prevPresenter === slideTracker.client
		) {
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
			<NavigationToast
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
			<NavigationToast
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
		console.log("bruh come on pls");
		slideTracker.client = props.slide;
		if (webSocket && props.isPresenter) {
			sendSlideUpdate(webSocket);
		}
	});

	createEffect(() => {
		if (!props.wsFlag || webSocket) return;
		console.log(webSocket);
		webSocket = new WebSocket(props.wsUrl);
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

			//TODO: after join message update slideTracker.presenter
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
			<div class="flex flex-col gap-2">
				<Button.Root onclick={() => showToast(props.slide)}>
					Toast
				</Button.Root>
				<Button.Root onclick={() => moveToPage(slideTracker.presenter)}>
					Follow Presenter
				</Button.Root>
			</div>
			<Portal>
				<Toast.Region>
					<Toast.List class=" fixed top-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-screen-xl m-0 z-[9999] outline-none" />
				</Toast.Region>
			</Portal>
		</div>
	);
}
