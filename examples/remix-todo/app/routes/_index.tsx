import type { MetaFunction } from "@remix-run/cloudflare";
import type { LinksFunction } from "@remix-run/cloudflare";

import styles from "../app.css";
import { useState } from "react";
import Header from "./Header";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export type Task = {
	index: number;
	item: string;
	done: boolean;
};

export default function Index() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [darkTheme, setDarkTheme] = useState(true);

	return (
		<div className={`${darkTheme ? "dark" : ""}`}>
			<div
				className={`bg-white dark:bg-black dark:text-slate-200 h-full w-full min-h-screen`}
			>
				<Header toggleDarkTheme={() => setDarkTheme(!darkTheme)} />
			</div>
		</div>
	);
}
