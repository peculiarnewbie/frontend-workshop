import {
	ChangeEvent,
	DragEvent,
	FormEvent,
	useEffect,
	useRef,
	useState,
} from "react";
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
	reorderPreview: 7,
	handleOvershoot: 8,
	preventDragOnEdit: 9,
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
	const [complexity, setComplexity] = useState("Elaborate");
	const [dragTargetIndex, setDragTargetIndex] = useState(-1);
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
			description: "you can just click off the task to save your edits",
		},
		{
			name: "fix edit on delete",
			active: true,
			isSub: true,
			description:
				"fixes a bug where the next task is selected after deleting",
		},
		{
			name: "reorder on drag",
			active: true,
			description: "reorder tasks by dragging them",
			subFeatures: [
				FeatureKeys.reorderPreview,
				FeatureKeys.handleOvershoot,
				FeatureKeys.preventDragOnEdit,
			],
		},
		{
			name: "reorder preview",
			active: true,
			description:
				"show feedback of where the reordered task will end up at",
			isSub: true,
		},
		{
			name: "handle overshoot",
			active: true,
			description:
				"if user reorders too far, reorder to the appropriate location",
			isSub: true,
		},
		{
			name: "fix drag on edit",
			active: true,
			description: "prevent dragging current task when editing",
			isSub: true,
		},
	]);
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
		newTasks.push({
			id: crypto.randomUUID(),
			item: inputTask,
			done: false,
		});
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

	const reorderTasks = (oldIndex: number, newIndex: number) => {
		const newTasks = [...tasks];
		const task = { ...newTasks[oldIndex] };

		let targetIndex = newIndex;

		if (features[FeatureKeys.handleOvershoot].active) {
			if (newIndex < 0) targetIndex = 0;
			else if (newIndex > tasks.length - 1)
				targetIndex = tasks.length - 1;
		} else {
			if (newIndex < 0 || newIndex > tasks.length - 1) {
				setDragTargetIndex(-1);
				return;
			}
		}

		newTasks.splice(oldIndex, 1);
		newTasks.splice(targetIndex, 0, task);
		setTasks(newTasks);
		setDragTargetIndex(-1);
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
			<div className="flex flex-col flex-1 overflow-auto items-center gap-[7px] p-6">
				{tasks.map((task, i) => (
					<div className="w-full" key={task.id}>
						<TaskItem
							task={task}
							index={i}
							updateTask={updateTask}
							deleteTask={deleteTask}
							features={features}
							setDragIndex={(index: number) =>
								setDragTargetIndex(index)
							}
							reorderTasks={reorderTasks}
						/>

						<div
							className={` w-full h-[2px] mt-[7px] ${
								dragTargetIndex == i &&
								features[FeatureKeys.reorderPreview].active
									? "bg-ctp-red"
									: "bg-transparent"
							}`}
						/>
					</div>
				))}
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
	features,
	setDragIndex,
	reorderTasks,
}: {
	task: Task;
	index: number;
	updateTask: (updatedTask: Task, index: number) => void;
	deleteTask: (index: number) => void;
	features: Feature[];
	setDragIndex: (index: number) => void;
	reorderTasks: (oldIndex: number, newIndex: number) => void;
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
		updateTask({ id: task.id, item: currentTask, done: false }, index);

		//@ts-expect-error
		inputRef.current.blur();
		setInputFocus(false);
	};

	const handleDrag = (e: DragEvent) => {
		const pos = e.pageY;
		//@ts-expect-error
		const el = inputRef.current as HTMLElement;

		const y = el.getBoundingClientRect().top - pos + 34;
		const newIndex = index - Math.floor(y / 68);
		setDragIndex(newIndex);
	};

	const handleReorder = (e: DragEvent) => {
		const pos = e.pageY;
		//@ts-expect-error
		const el = inputRef.current as HTMLElement;

		const y = el.getBoundingClientRect().top - pos + 34;
		const newIndex = index - Math.floor(y / 68);
		reorderTasks(index, newIndex);
	};

	useEffect(() => {
		setCurrentTask(task.item);
	}, [task]);

	return (
		<div
			draggable={`${
				features[FeatureKeys.reorderOnDrag].active &&
				(!inputFocus || !features[FeatureKeys.preventDragOnEdit].active)
					? "true"
					: "false"
			}`}
			className={` rounded-md bg-ctp-base font-semibold text-lg shadow-md w-full flex justify-between ${
				!inputFocus && features[FeatureKeys.editableTasks].active
					? "cursor-pointer"
					: ""
			}`}
			onClick={() => {
				if (!inputFocus && features[FeatureKeys.editableTasks].active) {
					//@ts-expect-error
					inputRef.current.focus();
					setInputFocus(true);
				}
			}}
			onDrag={handleDrag}
			onDragEnd={handleReorder}
		>
			{features[FeatureKeys.editableTasks].active ? (
				<form
					className=" min-w-0 grow flex p-3"
					onSubmit={handleUpdateTask}
				>
					<input
						ref={inputRef}
						className={`bg-transparent flex-1 outline-none ${
							inputFocus ? "" : "pointer-events-none"
						}`}
						value={currentTask}
						onChange={updateCurrentTask}
						onBlur={(e) => {
							if (features[FeatureKeys.updateOnBlur].active)
								handleUpdateTask(e);
						}}
						type="text"
					/>
				</form>
			) : (
				<div className="p-3">{task.item}</div>
			)}
			<div>
				<button
					className="h-full px-3 hover:bg-ctp-red rounded-r-md"
					onClick={(e) => {
						if (features[FeatureKeys.fixEditOnDelete].active)
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
