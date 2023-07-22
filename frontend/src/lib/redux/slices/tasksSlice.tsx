import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProviderAuthItem } from "./authSlice";
import { v4 as uuidv4 } from "uuid";

export type CreateTaskDTO = {
	domain: string;
	subdomain: string;
	loginAs?: ProviderAuthItem;
	taskDetails: any;
};

export interface TaskItem {
	uuid: string;
	domain: string;
	subdomain: string;

	// some tasks may not require login
	loginAs?: ProviderAuthItem;

	taskInProgress: boolean;
	taskDetails: any;
}

export interface TaskState {
	tasks: TaskItem[];
}

const initialState: TaskState = {
	tasks: [],
};

export const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		createTask: (state, action: PayloadAction<CreateTaskDTO>) => {
			state.tasks.push({
				uuid: uuidv4(),
				taskInProgress: false,
				...action.payload,
			});
		},
		deleteTask: (state, action: PayloadAction<string>) => {
			state.tasks = state.tasks.filter((t) => t.uuid !== action.payload);
		},
		updateTaskInProgress: (
			state,
			action: PayloadAction<{ uuid: string; inProgress: boolean }>
		) => {
			state.tasks = state.tasks.map((t) => {
				if (t.uuid === action.payload.uuid) {
					return {
						...t,
						taskInProgress: action.payload.inProgress,
					};
				}
				return t;
			});
		},
	},
});
