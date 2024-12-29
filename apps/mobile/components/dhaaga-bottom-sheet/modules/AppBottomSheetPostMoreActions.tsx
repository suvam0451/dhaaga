import { memo, useEffect, useReducer, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	Emoji,
} from './emoji-picker/emojiPickerReducer';
import PostMoreActionsPostTarget from './post-actions/fragments/PostMoreActionsPostTarget';
import EmojiPickerBottomSheet from './emoji-picker/EmojiPickerBottomSheet';
import ActivitypubReactionsService from '../../../services/approto/activitypub-reactions.service';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppPostObject } from '../../../types/app-post.types';
import {
	useAppBottomSheet_Improved,
	useAppPublishers,
} from '../../../hooks/utility/global-state-extractors';

const AppBottomSheetPostMoreActions = memo(() => {
	const { ctx, stateId } = useAppBottomSheet_Improved();
	const { postPub } = useAppPublishers();
	const [PostTarget, setPostTarget] = useState<AppPostObject>(
		postPub.readCache(ctx.uuid),
	);
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

	function postObjectUpdated({ uuid }: { uuid: string }) {
		setPostTarget(postPub.readCache(uuid));
	}

	useEffect(() => {
		if (!ctx.uuid) return;

		if (!postPub.readCache(ctx.uuid)) {
			setPostTarget(null);
			return;
		}

		postObjectUpdated({ uuid: ctx.uuid });
		postPub.subscribe(ctx.uuid, postObjectUpdated);
		return () => {
			postPub.unsubscribe(ctx.uuid, postObjectUpdated);
		};
	}, [ctx.uuid, stateId]);

	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);

	const [Loading, setLoading] = useState(false);

	async function onReactionRequested(emoji: Emoji) {
		const state = await ActivitypubReactionsService.addReaction(
			router,
			PostTarget.id,
			emoji.shortCode,
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

	useEffect(() => {
		if (lastSubdomain.current === acct?.server) return;
		// dispatch({
		// 	type: EMOJI_PICKER_REDUCER_ACTION.INIT,
		// 	payload: {
		// 		subdomain: acct?.server,
		// 		acctManager,
		// 		driver,
		// 	},
		// });
		lastSubdomain.current = acct?.server;
	}, [acct?.server]);

	return (
		<View style={[styles.root, { backgroundColor: theme.palette.menubar }]}>
			{EditMode === 'root' ? (
				<PostMoreActionsPostTarget
					item={PostTarget}
					setEditMode={setEditMode}
				/>
			) : EditMode === 'emoji' ? (
				<EmojiPickerBottomSheet
					onAccept={onReactionRequested}
					onCancel={() => {
						setEditMode('root');
					}}
				/>
			) : (
				<View />
			)}
		</View>
	);
});

export default AppBottomSheetPostMoreActions;

const styles = StyleSheet.create({
	root: {
		padding: 8,
	},
});
