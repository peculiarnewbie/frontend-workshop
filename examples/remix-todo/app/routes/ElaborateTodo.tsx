import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Task } from "./_index";
import { plus, trash } from "./icons";
import FeaturesMenu from "./FeaturesMenu";

export type Feature = {
	name: string;
	active: boolean;
	description?: string;
	subFeatures?: number[];
	isSub?: boolean;
};

export const FeatureKeys = {
	enterToSubmit: 0,
	clearOnSubmit: 1,
	validateEmpty: 2,
	editableTasks: 3,
	updateOnBlur: 4,
	fixEditOnDelete: 5,
	reorderOnDrag: 6,
};

function ElaborateTodo({
	tasks,
	setTasks,
}: {
	tasks: Task[];
	setTasks: (newTasks: Task[]) => void;
}) {
	const [inputTask, setInputTask] = useState("");
	const [featuresMenu, setFeaturesMenu] = useState(true);
	const [features, setFeatures] = useState<Feature[]>([
		{
			name: "enter to submit",
			active: true,
			description: "press enter on the input to add task",
		},
		{
			name: "clear on submit",
			active: true,
			description: "the input field will clear after adding tasks",
		},
		{
			name: "validate empty",
			active: true,
			description:
				"focus on input if you press add task while the field is empty",
		},
		{
			name: "editable tasks",
			active: true,
			description: "click the task to edit tasks",
			subFeatures: [
				FeatureKeys.updateOnBlur,
				FeatureKeys.fixEditOnDelete,
			],
		},
		{
			name: "update on blur",
			active: true,
			isSub: true,
		},
		{
			name: "fix edit on delete",
			active: true,
			isSub: true,
		},
		{
			name: "reorder on drag",
			active: true,
		},
	]);
	const [complexity, setComplexity] = useState("Elaborate");
	const inputRef = useRef(null);

	const updateInput = (e: ChangeEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setInputTask(value);
	};

	const addTask = (e: FormEvent) => {
		e.preventDefault();

		if (features[FeatureKeys.validateEmpty].active) {
			if (inputTask == "") {
				//@ts-expect-error
				inputRef.current.focus();
				return;
			}
		}

		const newTasks = [...tasks];
		newTasks.push({ item: inputTask, done: false });
		setTasks(newTasks);

		if (features[FeatureKeys.clearOnSubmit].active) setInputTask("");
	};

	const deleteTask = (index: number) => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1);
		setTasks(newTasks);
	};

	const toggleFeature = (index: number) => {
		const newFeatures = [...features];

		newFeatures[index].active = !newFeatures[index].active;
		setFeatures(newFeatures);
	};

	const calculateComplexity = () => {
		let featureCount = 0;
		for (let i = 0; i < features.length; i++) {
			if (features[i].active && !features[i].isSub) featureCount++;
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

	const updateTask = (updatedTask: Task, index: number) => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1, updatedTask);
		setTasks(newTasks);
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
					isForm={features[FeatureKeys.enterToSubmit].active}
					updateInput={updateInput}
					inputTask={inputTask}
					inputRef={inputRef}
				/>
			</div>
			<div className="flex flex-col flex-1 overflow-auto items-center gap-4 p-6">
				{tasks.map((task, i) => {
					return (
						<TaskItem
							key={i}
							task={task}
							index={i}
							updateTask={updateTask}
							deleteTask={deleteTask}
							clickToEdit={
								features[FeatureKeys.editableTasks].active
							}
						/>
					);
				})}
				<FeaturesMenu
					features={features}
					toggleFeature={toggleFeature}
					featuresMenu={featuresMenu}
					toggleFeaturesMenu={() => setFeaturesMenu(!featuresMenu)}
				/>
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
	inputRef,
}: {
	addTask: (e: FormEvent) => void;
	isForm: boolean;
	updateInput: (e: ChangeEvent) => void;
	inputTask: string;
	inputRef: React.MutableRefObject<null>;
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
					ref={inputRef}
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
					ref={inputRef}
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

function TaskItem({
	task,
	index,
	updateTask,
	deleteTask,
	clickToEdit,
}: {
	task: Task;
	index: number;
	updateTask: (updatedTask: Task, index: number) => void;
	deleteTask: (index: number) => void;
	clickToEdit: boolean;
}) {
	const [currentTask, setCurrentTask] = useState("");
	const [inputFocus, setInputFocus] = useState(false);

	const inputRef = useRef(null);

	const updateCurrentTask = (e: ChangeEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setCurrentTask(value);
	};

	const handleUpdateTask = (e: FormEvent) => {
		e.preventDefault();
		updateTask({ item: currentTask, done: false }, index);

		//@ts-expect-error
		inputRef.current.blur();
		setInputFocus(false);
	};

	useEffect(() => {
		setCurrentTask(task.item);
	}, [task]);

	return (
		<div
			className=" p-3 rounded-md bg-ctp-base font-semibold text-lg shadow-md w-full flex justify-between"
			onClick={() => {
				if (!inputFocus && clickToEdit) {
					//@ts-expect-error
					inputRef.current.focus();
					setInputFocus(true);
				}
			}}
		>
			{clickToEdit ? (
				<form className="flex-1 flex" onSubmit={handleUpdateTask}>
					<input
						ref={inputRef}
						className={`bg-transparent flex-1 outline-none ${
							inputFocus ? "" : "pointer-events-none"
						}`}
						value={currentTask}
						onChange={updateCurrentTask}
						onBlur={handleUpdateTask}
						type="text"
					/>
				</form>
			) : (
				<div>{task.item}</div>
			)}
			<div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						deleteTask(index);
					}}
				>
					{trash}
				</button>
			</div>
		</div>
	);
}
