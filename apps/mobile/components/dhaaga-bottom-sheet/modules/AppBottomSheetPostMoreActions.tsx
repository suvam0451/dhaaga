import { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from './emoji-picker/emojiPickerReducer';
import PostMoreActionsPostTarget from './post-actions/fragments/PostMoreActionsPostTarget';
import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../common/timeline/api/postArrayReducer';
import ActivitypubReactionsService from '../../../services/approto/activitypub-reactions.service';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppPostObject } from '../../../types/app-post.types';
import {
	useAppBottomSheet_Improved,
	useAppBottomSheet_TimelineReference,
	useAppManager,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';

const AppBottomSheetPostMoreActions = memo(() => {
	const [PostTarget, setPostTarget] = useState<AppPostObject>(null);
	const { router, driver, acct, hide, theme, acctManager } = useGlobalState(
		useShallow((o) => ({
			router: o.router,
			driver: o.driver,
			acct: o.acct,
			visible: o.bottomSheet.visible,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
			acctManager: o.acctManager,
		})),
	);

	const { stateId } = useAppBottomSheet_Improved();
	const { draft, dispatch: timelineDispatch } =
		useAppBottomSheet_TimelineReference();

	const { appManager } = useAppManager();
	useEffect(() => {
		const _post = appManager.storage.getBottomSheetPostActionsTarget();
		if (!_post) {
			setPostTarget(null);
			return;
		}
		setPostTarget(_post);
	}, [stateId]);

	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);

	const [Loading, setLoading] = useState(false);

	async function onReactionRequested(shortCode: string) {
		const state = await ActivitypubReactionsService.addReaction(
			router,
			PostTarget.id,
			shortCode,
			driver,
			setLoading,
		);

		// request reducer to update reaction state
		if (!state) return;
		// reducer({
		// 	type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
		// 	payload: {
		// 		id: postValue.id,
		// 		state,
		// 	},
		// });
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
				acctManager,
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

export default AppBottomSheetPostMoreActions;
