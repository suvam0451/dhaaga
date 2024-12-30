import { EmojiDto, styles } from './_shared.types';
import { memo, useMemo, useState } from 'react';
import {
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	Pressable,
} from 'react-native';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppBottomSheet } from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import * as Haptics from 'expo-haptics';
import ActivitypubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';
import { AppPostObject } from '../../../../types/app-post.types';
import {
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { Loader } from '../../../lib/Loader';

const EmojiReaction = memo(function Foo({
	dto,
	postDto,
}: {
	dto: EmojiDto;
	postDto: AppPostObject;
}) {
	const { dto: postItem } = useAppStatusItem();

	const {
		TextRef,
		PostRef,
		setType,
		setVisible,
		timelineDataPostListReducer,
		updateRequestId: updateBottomSheetRequestId,
	} = useAppBottomSheet();

	const { getPostListReducer } = useAppTimelinePosts();
	// TODO: use this to show loading animation in place
	const [EmojiStateLoading, setEmojiStateLoading] = useState(false);
	const { theme } = useAppTheme();
	const { postPub } = useAppPublishers();

	const CONTAINER_STYLE = useMemo(() => {
		if (dto.interactable) {
			if (dto.me) {
				return [
					styles.emojiContainer,
					{
						backgroundColor: theme.reactions.active,
						borderWidth: 2,
						borderColor: theme.primary.a0,
					},
				];
			} else {
				return [
					styles.emojiContainer,
					{ backgroundColor: theme.reactions.active },
				];
			}
		}
		return [
			styles.emojiContainer,
			{ backgroundColor: theme.reactions.inactive },
		];
	}, [dto.interactable, dto.me, theme]);

	async function onReactionPress() {
		// nothing to do on short press for remote emojis
		if (ActivitypubReactionsService.cannotReact(dto?.name)) {
			console.log('cannot react???');
			return;
		}
		await postPub.toggleReaction(postItem.uuid, dto, setEmojiStateLoading);

		// FIXME: bring back quick reaction settings
	}

	function onReactionLongPress() {
		return;

		// FIXME: bring back reaction preview (users who reacted)
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		TextRef.current = dto.name;
		PostRef.current = postDto;
		timelineDataPostListReducer.current = getPostListReducer();
		setType(APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS);
		updateBottomSheetRequestId();
		setVisible(true);
	}

	if (EmojiStateLoading) return <Loader />;
	if (dto.type === 'text') {
		return (
			<TouchableOpacity style={CONTAINER_STYLE} onPress={onReactionPress}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						// unicode emojis detected
						color:
							dto.name.length < 3 ? theme.secondary.a10 : theme.secondary.a30,
						fontSize: 14,
					}}
				>
					{dto.name}
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						color: theme.secondary.a10,
						marginLeft: 8,
					}}
				>
					{dto.count}
				</Text>
			</TouchableOpacity>
		);
	}

	if (dto.type === 'image') {
		return (
			<Pressable
				style={[localStyles.imageReactionContainer, CONTAINER_STYLE]}
				onPress={onReactionPress}
				onLongPress={onReactionLongPress}
			>
				<EmojiReactionImage
					url={dto.url}
					height={dto.height}
					width={dto.width}
				/>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						color: theme.secondary.a10,
						marginLeft: 8,
					}}
				>
					{dto.count}
				</Text>
			</Pressable>
		);
	}

	return <View />;
});

export default EmojiReaction;

const localStyles = StyleSheet.create({
	imageReactionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 8,
	},
});
