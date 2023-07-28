import { PayloadAction, createReducer, createSlice } from "@reduxjs/toolkit";

export type ColumnItem = {
	type: string;
	query: Record<string, string>;
	label: string;
};

export interface LatestTabRendererState {
	stack: ColumnItem[];
}

const initialState: LatestTabRendererState = {
	stack: [],
};

export const latestTabRendererSlice = createSlice({
	name: "latestTabRendered",
	initialState,
	reducers: {
		setStack: (state, action: PayloadAction<ColumnItem[]>) => {
			state.stack = action.payload;
		},
		updateStackByIndex(
			state,
			action: PayloadAction<{ index: number; item: ColumnItem }>
		) {
			state.stack[action.payload.index] = action.payload.item;
		},
		addStack(state, action: PayloadAction<ColumnItem>) {
			state.stack.push(action.payload);
		},
		/**
		 * triggered when back in pressed from any column
		 * deletes the descendants, as well.
		 *
		 * e.g. - when there are 3 columns, and user presses
		 * back for page 2, both page 2 and 3 will be cleared
		 */
		sliceStackByIndex(state, action: PayloadAction<number>) {
			state.stack = state.stack.slice(0, action.payload);
		},
		spliceStackAddItems(
			state,
			action: PayloadAction<{ index: number; items: ColumnItem[] }>
		) {
			state.stack.splice(
				action.payload.index,
				Infinity,
				...action.payload.items
			);
		},
	},
});
