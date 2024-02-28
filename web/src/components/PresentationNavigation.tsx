import { createSignal } from "solid-js";

function PresentationNavigation() {
	const [page, setPage] = createSignal(1);
	return (
		<div class="text-red-500">
			<button onclick={() => setPage(page() - 1)}>prev</button>
			<div>{page()}</div>
			<button onclick={() => setPage(page() + 1)}>next</button>
		</div>
	);
}

export default PresentationNavigation;
