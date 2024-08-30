import { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from '../../emoji-picker/emojiPickerReducer';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import PostMoreActionsPostTarget from '../fragments/PostMoreActionsPostTarget';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import ActivityPubService from '../../../../../services/activitypub.service';
import { PleromaRestClient } from '@dhaaga/shared-abstraction-activitypub';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';

const PostMoreActions = memo(() => {
	const { PostRef, timelineDataPostListReducer, setVisible } =
		useAppBottomSheet();
	const { client } = useActivityPubRestClientContext();
	const { domain, subdomain } = useActivityPubRestClientContext();
	const { globalDb } = useGlobalMmkvContext();
	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);

	async function onReactionRequested(shortCode: string) {
		try {
			if (ActivityPubService.pleromaLike) {
				const { data, error } = await (
					client as PleromaRestClient
				).statuses.addReaction(PostRef.current.id, shortCode);

				if (!error) {
					const { data: reactionData, error: reactionError } = await (
						client as PleromaRestClient
					).statuses.getReactions(PostRef.current.id);

					if (reactionError) {
						console.log('[WARN]: error fetching updated reaction state');
						return;
					}

					console.log(reactionData.map((o) => o.accounts));
					timelineDataPostListReducer.current({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
						payload: {
							id: PostRef.current.id,
							state: reactionData.map((o) => ({
								id: o.name.length > 2 ? `:${o.name}:` : o.name,
								me: o.me,
								count: o.count,
								accounts: o.accounts.map((o) => o.id) || [],
							})),
						},
					});
					setVisible(false);
				}
			}
		} catch (e) {
			console.log(e);
		}
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

const EMOJI_SIZE = 38;
const styles = StyleSheet.create({
	categoryLabel: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	emojiContainer: {
		width: EMOJI_SIZE,
		height: EMOJI_SIZE,
		borderRadius: 8,
		margin: 4,
	},
	textInput: {
		textDecorationLine: 'none',
		paddingVertical: 16,
		paddingBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
	},
});
