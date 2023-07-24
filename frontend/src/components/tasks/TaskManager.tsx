import { Box, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { TaskState } from "../../lib/redux/slices/tasksSlice";
import ThreadsProfileSyncTask from "./ThreadsProfileSyncTask";
import { TaskExecutionComponentCreateDTO } from "./types";

function TaskManager() {
	const dispatch = useDispatch<AppDispatch>();
	const tasks = useSelector<RootState, TaskState>((o) => o.tasks);

  const mapper: Record<
		string,
		Record<
			string,
			(props: TaskExecutionComponentCreateDTO) => React.JSX.Element
		>
	> = {
		meta: {
			threads: ThreadsProfileSyncTask,
		},
		mastodon: {},
	};

	function GetTaskExecutor(domain: string, subdomain: string) {
		if (!mapper[domain]) {
			return null;
		}

		const match = mapper[domain][subdomain];
		return match;
	}
	return (
		<Box>
			<Text size={32} align="center">Task Manager</Text>
			{tasks.tasks.map((o) => {
				const Executor = GetTaskExecutor(o.domain, o.subdomain);
				if (!Executor) {
					return <Box>Invalid Task</Box>;
				}
				return (
					<Executor
						uuid={o.uuid}
						loginAs={o.loginAs}
						taskDetails={o.taskDetails}
					/>
				);
			})}
		</Box>
	);
}

export default TaskManager;
