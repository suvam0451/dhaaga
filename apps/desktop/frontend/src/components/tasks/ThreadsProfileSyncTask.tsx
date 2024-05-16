import {
	Box,
	Button,
	Divider,
	Flex,
	Loader,
	LoadingOverlay,
	Text,
} from "@mantine/core";
import { TaskExecutionComponentCreateDTO } from "./types";
import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { TaskState, taskSlice } from "../../lib/redux/slices/tasksSlice";
import { GetTextFeedUsingCursor } from "../../../wailsjs/go/main/App";
import { GALLERY_FIXED_WIDTH } from "../../constants/app-dimensions";

function ThreadsProfileSyncTask({
	uuid,
	loginAs,
	taskDetails,
}: TaskExecutionComponentCreateDTO) {
	const dispatch = useDispatch<AppDispatch>();
	const tasks = useSelector<RootState, TaskState>((o) => o.tasks);
	const [TaskValid, setTaskValid] = useState(true);
	const [TaskCompleted, setTaskCompleted] = useState(false);
	const [CurrentPage, setCurrentPage] = useState<number>(0);
	const [NextCursor, setNextCursor] = useState<string>("");
	const [IsLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!taskDetails["access_token"] || !taskDetails["user_id"]) {
			setTaskValid(false);
			return;
		} else {
			setTaskValid(true);
		}
	}, [taskDetails]);

	function onTaskCancel() {
		dispatch(taskSlice.actions.deleteTask(uuid));
	}

	function onClickNext() {
		dispatch(
			taskSlice.actions.updateTaskInProgress({ uuid, inProgress: true })
		);
		setIsLoading(true);
		GetTextFeedUsingCursor(
			taskDetails["access_token"],
			taskDetails["user_id"].toString(),
			NextCursor
		)
			.then((res) => {
				setCurrentPage(CurrentPage + 1);
				setNextCursor(res);

				if (res === "") {
					setTaskCompleted(true);
				}
			})
			.finally(() => {
				dispatch(
					taskSlice.actions.updateTaskInProgress({ uuid, inProgress: false })
				);
				setIsLoading(false);
			});
	}
	return (
		<Box
			miw={GALLERY_FIXED_WIDTH}
			bg={"#ddd"}
			p={"md"}
			style={{ borderRadius: "0.25em" }}
		>
			<Flex direction={"column"}>
				<Flex direction={"row"} style={{ justifyContent: "space-between" }}>
					<Box>
						<Text style={{ fontWeight: 500 }}>Timeline Sync Task</Text>
						<Text size={12} color="#555">
							Meta, Threads
						</Text>
					</Box>
					<IconTrash size={28} color={"red"} onClick={onTaskCancel} />
				</Flex>
				<Divider size={"sm"} color={"#aaa"} my={"xs"} />
				<Flex direction={"column"}>
					<Text size={14}>
						Page Progress:{" "}
						{CurrentPage === 0
							? "N/A"
							: TaskCompleted
							? `${CurrentPage}/${CurrentPage}`
							: `${CurrentPage}/?`}
					</Text>
				</Flex>
				<Divider size={"sm"} color={"#ccc"} my={"xs"} />
				<Flex style={{ justifyContent: "flex-end" }}>
					<Button
						mx={"sm"}
						disabled={!TaskValid || IsLoading || TaskCompleted}
						onClick={onClickNext}
					>
						{IsLoading ? <Loader color="#fff" size={20} /> : "Start"}
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
}

export default ThreadsProfileSyncTask;
