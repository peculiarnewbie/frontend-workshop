import { Task } from "./_index";

function DecentTodo({
	tasks,
	updateTasks,
}: {
	tasks: Task[];
	updateTasks: (newTasks: Task[]) => void;
}) {
	return (
		<div className="h-full w-full bg-blue">
			<div>good</div>
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

export default DecentTodo;
