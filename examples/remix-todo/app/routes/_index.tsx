import type { MetaFunction } from "@remix-run/cloudflare";
import type { LinksFunction } from "@remix-run/cloudflare";

import styles from "../app.css";
import { useState } from "react";
import Header from "./Header";
import BasicTodo from "./BasicTodo";
import ElaborateTodo from "./ElaborateTodo";

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
				className={`flex flex-col min-h-screen w-full bg-ctp-base text-ctp-text overflow-auto`}
			>
				<Header darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
				<div className=" h-full flex flex-1 flex-col lg:flex-row w-full items-center p-12 justify-start sm:justify-center self-center place-self-center justify-self-center gap-12 lg:gap-24">
					<div className="flex flex-col h-[70vh] w-full bg-ctp-surface2 border-ctp-yellow border-2 rounded-xl overflow-clip shadow-lg max-w-[600px] min-w-80 min-h-96">
						<BasicTodo tasks={tasks} updateTasks={updateTasks} />
					</div>
					<div className="flex flex-col h-[70vh] w-full bg-ctp-surface2 border-ctp-blue border-2 rounded-xl overflow-clip shadow-lg max-w-[600px] min-w-80 min-h-96">
						<ElaborateTodo
							tasks={tasks}
							updateTasks={updateTasks}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
