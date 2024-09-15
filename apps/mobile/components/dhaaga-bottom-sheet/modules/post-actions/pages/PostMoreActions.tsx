import { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from '../../emoji-picker/emojiPickerReducer';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';
import PostMoreActionsPostTarget from '../fragments/PostMoreActionsPostTarget';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';
import ActivitypubReactionsService from '../../../../../services/approto/activitypub-reactions.service';

const PostMoreActions = memo(() => {
	const { PostRef, timelineDataPostListReducer, setVisible } =
		useAppBottomSheet();
	const { client } = useActivityPubRestClientContext();
	const { domain, subdomain } = useActivityPubRestClientContext();
	const { globalDb } = useGlobalMmkvContext();
	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);

	const [Loading, setLoading] = useState(false);
	async function onReactionRequested(shortCode: string) {
		const state = await ActivitypubReactionsService.addReaction(
			client,
			PostRef.current.id,
			shortCode,
			domain,
			setLoading,
		);

		// request reducer to update reaction state
		if (!state) return;
		timelineDataPostListReducer.current({
			type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
			payload: {
				id: PostRef.current.id,
				state,
			},
		});
		setVisible(false);
	}

	const [EditMode, setEditMode] = useState<'root' | 'emoji'>('root');
	const MainContent = useMemo(() => {
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
		if (lastSubdomain.current === subdomain) return;
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.INIT,
			payload: {
				subdomain,
				globalDb,
				domain,
			},
		});
		lastSubdomain.current = subdomain;
	}, [subdomain]);

	return <View style={{ padding: 8 }}>{MainContent}</View>;
});

export default PostMoreActions;
