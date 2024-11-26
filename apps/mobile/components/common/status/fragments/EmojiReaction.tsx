import { EmojiDto, styles } from './_shared.types';
import { memo, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import * as Haptics from 'expo-haptics';
import AppSettingsPreferencesService from '../../../../services/app-settings/app-settings-preferences.service';
// import { useRealm } from '@realm/react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../timeline/api/postArrayReducer';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import ActivityPubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import ActivitypubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const EmojiReaction = memo(function Foo({
	dto,
	postDto,
}: {
	dto: EmojiDto;
	postDto: ActivityPubStatusAppDtoType;
}) {
	const { domain, subdomain, client } = useActivityPubRestClientContext();
	// const db = useRealm();
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
	const { colorScheme } = useAppTheme();

	const CONTAINER_STYLE = useMemo(() => {
		if (dto.interactable) {
			if (dto.me) {
				return [
					styles.emojiContainer,
					{
						backgroundColor: colorScheme.reactions.active,
						borderWidth: 2,
						borderColor: colorScheme.reactions.highlight,
					},
				];
			} else {
				return [
					styles.emojiContainer,
					{ backgroundColor: colorScheme.reactions.active },
				];
			}
		}
		return [
			styles.emojiContainer,
			{ backgroundColor: colorScheme.reactions.inactive },
		];
	}, [dto.interactable, dto.me, colorScheme]);

	async function onReactionPress() {
		// const isQuickReactionEnabled =
		// 	AppSettingsPreferencesService.create(db).isQuickReactionEnabled();
		// FIXME: make this dynamic
		if (true) {
			const IS_REMOTE = ActivitypubReactionsService.canReact(dto?.name);
			if (!IS_REMOTE) {
				const { id } = ActivitypubReactionsService.extractReactionCode(
					TextRef.current,
					domain,
					subdomain,
				);

				const state = dto.me
					? await ActivityPubReactionsService.removeReaction(
							client,
							postDto.id,
							id,
							domain,
							setEmojiStateLoading,
						)
					: await ActivityPubReactionsService.addReaction(
							client,
							postDto.id,
							dto.name,
							domain,
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
