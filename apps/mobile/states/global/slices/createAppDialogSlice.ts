import { RandomUtil } from '@dhaaga/bridge';
import {
	AppGlobalState,
	AppStateImmerSetObject,
} from '#/states/global/typings';

type AppStateAppDialogContext =
	| {
			$type: 'text-prompt';
			placeholder: string; // this is the input
			userInput?: string; // this is the output
	  }
	| {
			/**
			 * Usage --> Bluesky ThreadGate
			 */
			$type: 'multi-select';
			options: string[];
			userSelection: string | null;
			multiSelect?: boolean;
			userSelections: string[];
	  }
	| null;

export type AppDialogButtonAction = {
	// label that appears on the button
	label: string;
	// action to perform on press
	onPress: () => Promise<void>;
	// variant of the button (impacts theming)
	variant?:
		| 'default'
		| 'switch'
		| 'important'
		| 'dismiss'
		| 'warning'
		| 'destructive';
	selected?: boolean;
};
export type AppStateAppDialogState = {
	title: string;
	description: string[];
	actions: AppDialogButtonAction[];
	/**
	 * unlike the bottom sheets, there should
	 * be no continuity between two separate
	 * calls to show the dialog.
	 */
	stateId: string;
	visible: boolean;
	initialState: AppStateAppDialogContext | null;
	state: AppStateAppDialogContext | null;
	callback: (
		context: AppStateAppDialogContext,
		hasChanged: boolean,
	) => void | null;
};

export type AppDialogInstanceState = {
	title: string;
	description: string[];
	actions: AppDialogButtonAction[];
};

export type AppStateAppDialogActions = {
	show: (
		data: AppDialogInstanceState,
		context?: AppStateAppDialogContext,
		callback?: (context: AppStateAppDialogContext) => void,
	) => void;
	reset: () => void;
	hide: () => void;
	submit: () => void;
	setState: (context: AppStateAppDialogContext) => void;
};

function createAppDialogSlice(
	set: AppStateImmerSetObject,
	get: () => AppGlobalState,
): AppStateAppDialogState & AppStateAppDialogActions {
	return {
		/**
		 * ---- STATE ----
		 */

		title: null,
		description: null,
		actions: [],
		stateId: RandomUtil.nanoId(),
		visible: false,
		initialState: null,
		state: null,
		callback: null,

		/**
		 * ---- ACTIONS ----
		 */

		show: (data: AppDialogInstanceState, context, callback) => {
			set((state) => {
				state.dialog.title = data.title;
				state.dialog.description = data.description;
				state.dialog.actions = data.actions;
				state.dialog.stateId = RandomUtil.nanoId();
				state.dialog.initialState = context;
				state.dialog.state = context;
				state.dialog.callback = callback;
				state.dialog.visible = true;
			});
		},
		hide: () => {
			set((state) => {
				state.dialog.visible = false;
			});
		},
		submit: () => {
			set((state) => {
				state.dialog.visible = false;
			});
			if (get().dialog.callback) {
				get().dialog.callback(get().dialog.state, true);
			}
		},
		reset: () => {
			set((state) => {
				state.dialog.stateId = RandomUtil.nanoId();
				state.dialog.state = null;
				state.dialog.initialState = null;
				state.dialog.callback = null;
			});
		},
		setState: (context) => {
			set((state) => {
				state.dialog.state = context;
			});
		},
	};
}

export default createAppDialogSlice;
