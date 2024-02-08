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
		<div className="h-full w-full bg-rose-400 dark:bg-rose-800">
			<div>whaa</div>
			<input type="text" onChange={updateInput} />
			<button onClick={addTask}>add Task</button>
			<div className="flex flex-col">
				{tasks.map((task) => {
					return (
						<div className=" p-5">
							<div>{task.item}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default BasicTodo;
