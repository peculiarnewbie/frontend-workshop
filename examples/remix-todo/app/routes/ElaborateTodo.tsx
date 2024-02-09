import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Task } from "./_index";
import { plus, trash } from "./icons";

function ElaborateTodo({
	tasks,
	updateTasks,
}: {
	tasks: Task[];
	updateTasks: (newTasks: Task[]) => void;
}) {
	const [inputTask, setInputTask] = useState("");
	const [features, setFeatures] = useState({
		enterToSubmit: true,
		clearOnSubmit: true,
		validateEmpty: true,
		reorderOnDrag: true,
		clickToEdit: true,
	});
	const [complexity, setComplexity] = useState("Elaborate");
	const inputRef = useRef(null);

	const updateInput = (e: ChangeEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setInputTask(value);
	};

	const handleAddTask = () => {};

	const addTask = (e: FormEvent) => {
		e.preventDefault();
		const newTasks = [...tasks];
		newTasks.push({ item: inputTask, done: false });
		updateTasks(newTasks);

		if (!features.clearOnSubmit) return;
		setInputTask("");
	};

	const deleteTask = (index: number) => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1);
		updateTasks(newTasks);
	};

	const toggleFeature = (feature: string) => {
		const newFeatures = { ...features };
		//@ts-expect-error
		newFeatures[`${feature}`] = !newFeatures[`${feature}`];
		setFeatures(newFeatures);
	};

	const camelToNormal = (feature: string): string => {
		return feature
			.replace(/([a-z])([A-Z])/g, "$1 $2") // inserts a space between lowercase and uppercase letters
			.toLowerCase();
	};

	const calculateComplexity = () => {
		let featureCount = 0;
		const array = Object.entries(features);
		for (let i = 0; i < array.length; i++) {
			const [item, value] = array[i];
			if (value) featureCount++;
		}

		switch (featureCount) {
			case 0:
				setComplexity("Basically Basic");
				break;
			case 1:
			case 2:
				setComplexity("Simple");
				break;
			case 3:
			case 4:
				setComplexity("Decent");
				break;
			case 5:
				setComplexity("Elaborate");
		}
	};

	useEffect(() => {
		calculateComplexity();
	}, [features]);

	return (
		<>
			<div className=" bg-ctp-surface1 flex flex-col items-center p-6">
				<p className=" text-4xl font-bold">{complexity}</p>
				<div className=" p-2" />
				<TaskInput
					addTask={addTask}
					isForm={features.enterToSubmit}
					updateInput={updateInput}
					inputTask={inputTask}
				/>
				{/* <form
					onSubmit={addTask}
					className="ctp-latte flex gap-4 w-full max-w-96"
				>
					<input
						className=" bg-ctp-base text-ctp-text rounded-md p-2 outline-ctp-blue outline-offset-1 font-semibold w-full"
						type="text"
						onChange={updateInput}
						ref={inputRef}
					/>
					<button
						className=" text-3xl font-bold bg-ctp-blue text-white outline-ctp-yellow rounded-full aspect-square h-10 align-text-top flex justify-center items-center"
						type="submit"
					>
						{plus}
					</button>
				</form> */}
			</div>
			<div className="flex flex-col flex-1 overflow-auto items-center gap-4 p-6 relative">
				{tasks.map((task, i) => {
					return (
						<div className=" p-3 rounded-md bg-ctp-base font-semibold text-lg shadow-md w-full flex justify-between">
							<div>{task.item}</div>
							<div>
								<button onClick={() => deleteTask(i)}>
									{trash}
								</button>
							</div>
						</div>
					);
				})}
				<div className="absolute bottom-0 p-4 bg-ctp-base w-full h-fit rounded-t-xl flex gap-2 transition-all duration-200 flex-wrap justify-center">
					{Object.keys(features).map((feature) => {
						return (
							<button
								className={`p-2 ctp-latte text-ctp-text rounded-md border-2 duration-75 transition-all w-24 ${
									//@ts-expect-error
									features[`${feature}`]
										? " bg-ctp-blue font-semibold text-white  border-white"
										: "bg-ctp-surface1 border-transparent"
								}`}
								onClick={() => toggleFeature(feature)}
							>
								{camelToNormal(feature)}
							</button>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default ElaborateTodo;

function TaskInput({
	addTask,
	isForm,
	updateInput,
	inputTask,
}: {
	addTask: (e: FormEvent) => void;
	isForm: boolean;
	updateInput: (e: ChangeEvent) => void;
	inputTask: string;
}) {
	if (isForm)
		return (
			<form
				onSubmit={addTask}
				className="ctp-latte flex gap-4 w-full max-w-96"
			>
				<input
					className=" bg-ctp-base text-ctp-text rounded-md p-2 outline-ctp-blue outline-offset-1 font-semibold w-full"
					type="text"
					onChange={updateInput}
					value={inputTask}
				/>
				<button
					className=" text-3xl font-bold bg-ctp-blue text-white outline-ctp-yellow rounded-full aspect-square h-10 align-text-top flex justify-center items-center"
					type="submit"
				>
					{plus}
				</button>
			</form>
		);
	else
		return (
			<div className="ctp-latte flex gap-4 w-full max-w-96">
				<input
					className=" bg-ctp-base text-ctp-text rounded-md p-2 outline-ctp-blue outline-offset-1 font-semibold w-full"
					type="text"
					onChange={updateInput}
					value={inputTask}
				/>
				<button
					className=" text-3xl font-bold bg-ctp-blue text-white outline-ctp-yellow rounded-full aspect-square h-10 align-text-top flex justify-center items-center"
					onClick={addTask}
				>
					{plus}
				</button>
			</div>
		);
}
