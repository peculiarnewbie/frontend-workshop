import type { MetaFunction } from "@remix-run/cloudflare";
import type { LinksFunction } from "@remix-run/cloudflare";

import styles from "../app.css";
import { useState } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	const [tasks, setTasks] = useState([]);
	const [darkTheme, setDarkTheme] = useState(true);

	return (
		<div className={`${darkTheme ? "dark" : ""}`}>
			<div
				className={`bg-white dark:bg-black dark:text-slate-200 h-full w-full min-h-screen`}
			>
				<header className=" flex justify-center">
					<div className="container flex justify-between">
						<p>logo</p>
						<div className="flex">
							<nav>hi</nav>
							<nav>hey</nav>
						</div>
					</div>
				</header>
			</div>
		</div>
	);
}
