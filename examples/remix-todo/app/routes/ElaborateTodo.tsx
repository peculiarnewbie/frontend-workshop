import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Task } from "./_index";
import { plus, trash, upArrow } from "./icons";

function ElaborateTodo({
	tasks,
	setTasks,
}: {
	tasks: Task[];
	setTasks: (newTasks: Task[]) => void;
}) {
	const [inputTask, setInputTask] = useState("");
	const [featuresMenu, setFeaturesMenu] = useState(false);
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

	const addTask = (e: FormEvent) => {
		e.preventDefault();

		if (features.validateEmpty) {
			if (inputTask == "") {
				//@ts-expect-error
				inputRef.current.focus();
				return;
			}
		}

		const newTasks = [...tasks];
		newTasks.push({ item: inputTask, done: false });
		setTasks(newTasks);

		if (features.clearOnSubmit) setInputTask("");
	};

	const deleteTask = (index: number) => {
		const newTasks = [...tasks];
		newTasks.splice(index, 1);
		setTasks(newTasks);
	};

	const toggleFeature = (feature: string) => {
		const newFeatures = { ...features };
		//@ts-expect-error
		newFeatures[`${feature}`] = !newFeatures[`${feature}`];
		setFeatures(newFeatures);
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
					isForm={features.enterToSubmit}
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
							clickToEdit={features.clickToEdit}
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

function FeaturesMenu({
	features,
	toggleFeature,
	featuresMenu,
	toggleFeaturesMenu,
}: {
	features: { [key: string]: boolean };
	toggleFeature: (feature: string) => void;
	featuresMenu: boolean;
	toggleFeaturesMenu: () => void;
}) {
	const camelToNormal = (feature: string): string => {
		return feature
			.replace(/([a-z])([A-Z])/g, "$1 $2") // inserts a space between lowercase and uppercase letters
			.toLowerCase();
	};
	return (
		<div
			className={`absolute bottom-0 w-full transition-all  ${
				featuresMenu ? "h-24" : "h-0"
			}`}
		>
			<div className="relative w-full h-full flex flex-col">
				<div className="absolute w-full flex justify-center -top-16 h-0">
					<button
						className={`relative mx-auto font-medium text-lg flex flex-col w-24 items-center `}
						onClick={toggleFeaturesMenu}
					>
						<PopupButton featuresMenu={featuresMenu} />
					</button>
				</div>
				<div className=" w-full rounded-t-xl flex-1 h-0 overflow-hidden">
					<div className="p-4 bg-ctp-surface1 w-full overflow-x-auto overflow-y-hidden h-full flex justify-between">
						<div className="w-fit flex gap-2 flex-nowrap justify-between flex-1 h-full text-sm md:text-base">
							{Object.keys(features).map((feature) => {
								return (
									<button
										className={`px-2 flex items-center text-ctp-text rounded-md border-2 duration-200 transition-all w-24 ${
											features[`${feature}`]
												? " bg-ctp-blue font-semibold text-white border-white ctp-latte"
												: "bg-ctp-surface2 border-transparent"
										}`}
										onClick={() => toggleFeature(feature)}
									>
										{camelToNormal(feature)}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function PopupButton({ featuresMenu }: { featuresMenu: boolean }) {
	return (
		<>
			<div
				className={`mx-auto w-fit transition-transform duration-500 scale-x-150 ${
					featuresMenu ? " translate-y-8 rotate-180" : "translate-y-2"
				}`}
			>
				{upArrow}
			</div>
			<div className="absolute">
				<p
					className={` translate-y-2 transition-opacity duration-200 ${
						featuresMenu ? " opacity-100" : " opacity-0"
					}`}
				>
					close
				</p>
				<p
					className={` transition-opacity duration-200 ${
						featuresMenu ? " opacity-0" : " opacity-100"
					}`}
				>
					features
				</p>
			</div>
		</>
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
					inputRef.current.focus();
					setInputFocus(true);
				}
			}}
		>
			{clickToEdit ? (
				<form onSubmit={handleUpdateTask}>
					<input
						ref={inputRef}
						className={`bg-transparent outline-none ${
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
				<button onClick={() => deleteTask(index)}>{trash}</button>
			</div>
		</div>
	);
}
