import { ChangeEvent, MouseEvent, useState } from "react";
import { Task } from "./_index";

function BasicTodo({
	tasks,
	updateTasks,
}: {
	tasks: Task[];
	updateTasks: (newTasks: Task[]) => void;
}) {
	const [inputTask, setInputTask] = useState("");

	const updateInput = (e: ChangeEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setInputTask(value);
	};

	const addTask = () => {
		const newTasks = [...tasks];
		newTasks.push({ item: inputTask, done: false });
		updateTasks(newTasks);
	};

	return (
		<div className="h-full w-full bg-ctp-surface2 border-ctp-yellow border-2 rounded-xl overflow-clip shadow-lg">
			<div className=" bg-ctp-surface1 flex flex-col items-center p-6">
				<p className=" text-4xl font-bold">Basic</p>
				<div className=" p-2" />
				<div className="ctp-latte flex gap-4">
					<input
						className=" bg-ctp-base text-ctp-text rounded-md p-2 outline-ctp-yellow outline-offset-1 font-semibold"
						type="text"
						onChange={updateInput}
					/>
					<button
						className=" text-3xl font-bold bg-ctp-yellow text-white outline-ctp-yellow rounded-full aspect-square h-10 align-text-top"
						onClick={addTask}
					>
						+
					</button>
				</div>
			</div>
			<div className="flex flex-col items-center gap-4 p-6">
				{tasks.map((task) => {
					return (
						<div className=" p-3 rounded-md bg-ctp-base font-semibold text-lg shadow-md w-full flex justify-between">
							<div>{task.item}</div>
							<div>
								<button>del</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default BasicTodo;
