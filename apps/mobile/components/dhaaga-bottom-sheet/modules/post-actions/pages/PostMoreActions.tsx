import { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from '../../emoji-picker/emojiPickerReducer';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';
import PostMoreActionsPostTarget from '../fragments/PostMoreActionsPostTarget';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';
import ActivitypubReactionsService from '../../../../../services/approto/activitypub-reactions.service';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const PostMoreActions = memo(() => {
	const { router, driver, acct, postValue, reducer, hide, theme } =
		useGlobalState(
			useShallow((o) => ({
				router: o.router,
				driver: o.driver,
				acct: o.acct,
				postValue: o.bottomSheet.postValue,
				reducer: o.bottomSheet.timelineDataPostListReducer,
				visible: o.bottomSheet.visible,
				hide: o.bottomSheet.hide,
				theme: o.colorScheme,
			})),
		);
	const { globalDb } = useGlobalMmkvContext();
	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);

	const [Loading, setLoading] = useState(false);

	async function onReactionRequested(shortCode: string) {
		const state = await ActivitypubReactionsService.addReaction(
			router,
			postValue.id,
			shortCode,
			driver,
			setLoading,
		);

		// request reducer to update reaction state
		if (!state) return;
		reducer({
			type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
			payload: {
				id: postValue.id,
				state,
			},
		});
		hide();
	}

	const [EditMode, setEditMode] = useState<'root' | 'emoji'>('root');
	const MainContent = useMemo(() => {
		console.log(EditMode);
		switch (EditMode) {
			case 'root': {
				return <PostMoreActionsPostTarget setEditMode={setEditMode} />;
			}
			case 'emoji': {
				return (
					<EmojiPickerBottomSheet
						onSelect={onReactionRequested}
						onCancel={() => {
							setEditMode('root');
						}}
					/>
				);
			}
		}
	}, [EditMode]);

	useEffect(() => {
		if (lastSubdomain.current === acct?.server) return;
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.INIT,
			payload: {
				subdomain: acct?.server,
				globalDb,
				driver,
			},
		});
		lastSubdomain.current = acct?.server;
	}, [acct?.server]);

	return (
		<View style={{ padding: 8, backgroundColor: theme.palette.menubar }}>
			{MainContent}
		</View>
	);
});

export default PostMoreActions;
