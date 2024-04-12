import { Button, Toast } from "@kobalte/core";
import { onCleanup } from "solid-js";

export default function NavigationToast(props: {
	id: number;
	currentPage: number;
	onAction?: () => void;
	onCleanup?: () => void;
}) {
	onCleanup(() => {
		if (props.onCleanup) props.onCleanup();
	});

	return (
		<Toast.Root
			toastId={props.id}
			class="flex flex-col items-center justify-between gap-2 rounded-md p-3 bg-ctp-mantle/50 dark:bg-ctp-surface0 text-ctp-text border border-ctp-crust shadow-md
				data-[opened]:animate-sonner-fade-in data-[closed]:animate-sonner-fade-out"
		>
			<Toast.ProgressTrack class=" h-2 w-full bg-ctp-surface0 dark:bg-ctp-surface2 rounded-sm">
				<Toast.ProgressFill
					class="bg-blue-500 rounded-sm h-full"
					style={{
						width: `var(--kb-toast-progress-fill-width)`,
						transition: "width 250ms linear",
					}}
				/>
			</Toast.ProgressTrack>
			<div class="flex flex-col w-full items-center">
				<Toast.Title class="toast__title">
					{`Presenter moved to slide ${props.currentPage}`}
				</Toast.Title>
				<div class="pt-2 flex gap-2">
					<Button.Root
						class=" px-2 py-1.5 bg-blue-500 rounded-md text-slate-200"
						onclick={props.onAction}
					>
						Follow
					</Button.Root>
					<Toast.CloseButton class=" px-2 py-1.5 bg-red-500 rounded-md text-slate-200">
						Close
					</Toast.CloseButton>
				</div>
			</div>
		</Toast.Root>
	);
}
