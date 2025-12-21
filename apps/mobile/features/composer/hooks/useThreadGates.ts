import {
	PostComposerAction,
	usePostComposerDispatch,
	usePostComposerState,
} from '@dhaaga/react';
import { useAppDialog } from '#/states/global/hooks';

function useThreadGates() {
	const State = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { show } = useAppDialog();

	function onPress() {
		show({
			title: 'Limit Interaction',
			description: ['Set who can reply to this post.'],
			actions: [
				{
					label: 'Everybody',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_ALL,
						});
					},
					selected: State.threadGates.length === 0,
				},
				{
					label: 'Nobody',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_NONE,
						});
					},
					selected: State.threadGates.includes('nobody'),
				},
				{
					label: 'Your Followers',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_FOLLOWERS,
						});
					},
					selected: State.threadGates.includes('followers'),
				},
				{
					label: 'People you Follow',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_FOLLOWEES,
						});
					},
					selected: State.threadGates.includes('following'),
				},
				{
					label: 'People you Mention',
					variant: 'switch',
					onPress: async () => {
						dispatch({
							type: PostComposerAction.THREADGATE_SET_MENTIONED,
						});
					},
					selected: State.threadGates.includes('mentioned'),
				},
			],
		});
	}

	return { onPress };
}

export default useThreadGates;
