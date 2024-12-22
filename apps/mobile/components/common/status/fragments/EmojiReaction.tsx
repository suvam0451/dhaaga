import { EmojiDto, styles } from './_shared.types';
import { memo, useMemo, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppBottomSheet } from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import * as Haptics from 'expo-haptics';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../timeline/api/postArrayReducer';
import { ActivityPubStatusAppDtoType_DEPRECATED } from '../../../../services/app-status-dto.service';
import ActivityPubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import ActivitypubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const EmojiReaction = memo(function Foo({
	dto,
	postDto,
}: {
	dto: EmojiDto;
	postDto: ActivityPubStatusAppDtoType_DEPRECATED;
}) {
	const { driver, acct, client, show } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			acct: o.acct,
			show: o.bottomSheet.show,
		})),
	);

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
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const CONTAINER_STYLE = useMemo(() => {
		if (dto.interactable) {
			if (dto.me) {
				return [
					styles.emojiContainer,
					{
						backgroundColor: theme.reactions.active,
						borderWidth: 2,
						borderColor: theme.reactions.highlight,
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
		// const isQuickReactionEnabled =
		// 	AppSettingsPreferencesService.create(db).isQuickReactionEnabled();
		// FIXME: make this dynamic
		if (true) {
			const IS_REMOTE = ActivitypubReactionsService.canReact(dto?.name);
			if (!IS_REMOTE) {
				const { id } = ActivitypubReactionsService.extractReactionCode(
					TextRef.current,
					driver,
					acct?.server,
				);

				const state = dto.me
					? await ActivityPubReactionsService.removeReaction(
							client,
							postDto.id,
							id,
							driver,
							setEmojiStateLoading,
						)
					: await ActivityPubReactionsService.addReaction(
							client,
							postDto.id,
							dto.name,
							driver,
							setEmojiStateLoading,
						);
				if (state !== null) {
					getPostListReducer()({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
						payload: {
							id: postDto.id,
							state,
						},
					});
				}
			}
		} else {
			TextRef.current = dto.name;
			PostRef.current = postDto;
			timelineDataPostListReducer.current = getPostListReducer();
			setType(APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS);
			updateBottomSheetRequestId();
			setVisible(true);
		}
	}

	function onReactionLongPress() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		TextRef.current = dto.name;
		PostRef.current = postDto;
		timelineDataPostListReducer.current = getPostListReducer();
		setType(APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS);
		updateBottomSheetRequestId();
		setVisible(true);
	}

	if (dto.type === 'text') {
		return (
			<TouchableOpacity style={CONTAINER_STYLE} onPress={onReactionPress}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color:
							dto.name.length < 3
								? APP_FONT.MONTSERRAT_HEADER
								: APP_FONT.MONTSERRAT_BODY,
						fontSize: 14,
					}}
				>
					{dto.name}
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
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
			<TouchableOpacity
				style={CONTAINER_STYLE}
				onPress={onReactionPress}
				onLongPress={onReactionLongPress}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 8,
					}}
				>
					<EmojiReactionImage
						url={dto.url}
						height={dto.height}
						width={dto.width}
					/>
					<View>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								marginLeft: 8,
							}}
						>
							{dto.count}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return <View />;
});

export default EmojiReaction;
