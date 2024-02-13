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
		{ title: "UX Todo" },
		{
			name: "description",
			content: "Simple demonstration of UX features in a todo app",
		},
	];
};

export type Task = {
	id: string;
	item: string;
	done: boolean;
};

export default function Index() {
	const [tasks, setTasks] = useState<Task[]>([
		{ id: crypto.randomUUID(), item: "do stuff", done: false },
		{ id: crypto.randomUUID(), item: "stuff done", done: true },
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
				<h1 className=" w-full flex justify-center items-center pt-8 pb-8 lg:pb-0 text-3xl font-bold">
					Todo UX demonstration
				</h1>
				<div className=" h-fit lg:h-full flex flex-1 flex-col lg:flex-row  w-full items-center px-12 pb-12 justify-start sm:justify-center self-center place-self-center justify-self-center gap-12 lg:gap-24">
					<div className="flex flex-col h-[70vh] w-full bg-ctp-surface2 border-ctp-yellow border-2 rounded-xl overflow-clip shadow-lg max-w-[600px] min-w-80 min-h-96">
						<BasicTodo tasks={tasks} updateTasks={updateTasks} />
					</div>
					<div className="flex flex-col h-[70vh] w-full bg-ctp-surface2 border-ctp-blue border-2 rounded-xl overflow-clip shadow-lg max-w-[600px] min-w-80 min-h-96 relative">
						<ElaborateTodo tasks={tasks} setTasks={updateTasks} />
					</div>
				</div>
				<div className="w-full justify-center flex gap-2 pb-4">
					<p>by</p>
					<a
						className=" hover:text-ctp-blue"
						href="https://peculiarnewbie.com"
					>
						peculiarnewbie
					</a>
				</div>
			</div>
		</div>
	);
}
