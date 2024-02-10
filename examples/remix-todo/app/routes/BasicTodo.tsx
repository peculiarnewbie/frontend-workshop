import { ChangeEvent, MouseEvent, useState } from "react";
import { Task } from "./_index";
import { plus, trash } from "./icons";

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

	const deleteTask = (index: number) => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1);
		updateTasks(newTasks);
	};

	return (
		<>
			<div className=" bg-ctp-surface1 flex flex-col items-center p-6">
				<p className=" text-4xl font-bold">Basic</p>
				<div className=" p-2" />
				<div className="ctp-latte flex gap-4 w-full max-w-96">
					<input
						className=" bg-ctp-base text-ctp-text rounded-md p-2 outline-ctp-yellow outline-offset-1 font-semibold w-full"
						type="text"
						onChange={updateInput}
					/>
					<button
						className=" text-3xl font-bold bg-ctp-yellow text-white outline-ctp-yellow rounded-full aspect-square h-10 align-text-top flex justify-center items-center"
						onClick={addTask}
					>
						{plus}
					</button>
				</div>
			</div>
			<div className="flex flex-col flex-1 overflow-auto items-center gap-4 p-6 ">
				{tasks.map((task, i) => {
					return (
						<div
							key={i}
							className=" p-3 rounded-md bg-ctp-base font-semibold text-lg shadow-md w-full flex justify-between"
						>
							<div>{task.item}</div>
							<div>
								<button onClick={() => deleteTask(i)}>
									{trash}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default BasicTodo;
