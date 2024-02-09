import type { MetaFunction } from "@remix-run/cloudflare";
import type { LinksFunction } from "@remix-run/cloudflare";

import styles from "../app.css";
import { useState } from "react";
import Header from "./Header";
import BasicTodo from "./BasicTodo";
import DecentTodo from "./DecentTodo";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export type Task = {
	item: string;
	done: boolean;
};

export default function Index() {
	const [tasks, setTasks] = useState<Task[]>([
		{ item: "do stuff", done: false },
		{ item: "stuff done", done: true },
	]);
	const [darkTheme, setDarkTheme] = useState(true);

	const updateTasks = (newTasks: Task[]) => {
		setTasks(newTasks);
	};

	return (
		<div className={`${darkTheme ? "ctp-mocha dark" : "ctp-latte"}`}>
			<div
				className={`flex flex-col h-screen w-full bg-ctp-base text-ctp-text`}
			>
				<Header darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
				<div className="h-full flex flex-col">
					<div className=" h-1/6 max-h-24" />
					<div className="h-full flex flex-col lg:flex-row">
						<div className="px-20 w-full">
							<BasicTodo
								tasks={tasks}
								updateTasks={updateTasks}
							/>
						</div>
						<div className="px-20 w-full">
							<DecentTodo
								tasks={tasks}
								updateTasks={updateTasks}
							/>
						</div>
					</div>

					<div className=" h-1/6 max-h-24" />
				</div>
			</div>
			<div>
				<div className="bg-ctp-base">base</div>

				<div className=" bg-ctp-surface0">surface0</div>
				<div className=" bg-ctp-surface1">surface1</div>
				<div className=" bg-ctp-surface2">surface2</div>
				<div className=" bg-ctp-mantle">mantle</div>
				<div className=" bg-ctp-crust">crust</div>
				<div className=" bg-ctp-surface2 text-ctp-overlay2">
					overlay2
				</div>
				<div className=" bg-ctp-surface2 text-ctp-overlay0">
					overlay0
				</div>
			</div>
		</div>
	);
}
