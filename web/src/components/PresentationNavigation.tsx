import { createEffect, createSignal } from "solid-js";

function PresentationNavigation(props: { slide: number }) {
	const [page, setPage] = createSignal(1);

	const nextPage = () => {
		window.location.href = `/slides/${Number(props.slide) + 1}`;
	};

	return (
		<div class="text-red-500">
			<button onclick={() => setPage(page() - 1)}>prev</button>
			<div>{page()}</div>
			<button onclick={nextPage}>next</button>
		</div>
	);
}

export default PresentationNavigation;
