import { Ionicons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Divider } from '@rneui/themed';
import PostStats from '../PostStats';
import * as Haptics from 'expo-haptics';
import BoostAdvanced from '../../../dialogs/BoostAdvanced';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import AntDesign from '@expo/vector-icons/AntDesign';
import PostActionButtonToggleBookmark from './modules/PostActionButtonToggleBookmark';
import PostActionButtonToggleLike from './modules/PostActionButtonToggleLike';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

type StatusInteractionProps = {
	openAiContext?: string[];
	dto: ActivityPubStatusAppDtoType;
};

const ICON_SIZE = 24;

const StatusInteraction = memo(
	({ openAiContext, dto }: StatusInteractionProps) => {
		const {
			setVisible: setBottomSheetVisible,
			setType,
			PostComposerTextSeedRef,
			PostRef,
			ParentRef,
			updateRequestId: updateBottomSheetRequestId,
			timelineDataPostListReducer,
			RootRef,
		} = useAppBottomSheet();
		const { client } = useActivityPubRestClientContext();
		const { explain, boost, getPostListReducer } = useAppTimelinePosts();

		const STATUS_DTO = dto;

		// local state
		const IS_BOOKMARKED = STATUS_DTO.interaction.bookmarked;
		const IS_TRANSLATED =
			STATUS_DTO.calculated.translationOutput !== undefined &&
			STATUS_DTO.calculated.translationOutput !== null;
		const IS_BOOSTED = dto.interaction.boosted;
		const IS_LIKED = STATUS_DTO.interaction.liked;

		// loading state
		const [IsTranslateStateLoading, setIsTranslateStateLoading] =
			useState(false);
		const [IsBoostStatePending, setIsBoostStatePending] = useState(false);

		const [BoostOptionsVisible, setBoostOptionsVisible] = useState(false);
		const { colorScheme } = useAppTheme();

		function onTranslationLongPress() {
			// TODO: implement instance translation
			//  + fedilab libre translate endpoint.
			if (
				!process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
				process.env.EXPO_PUBLIC_OPENAI_API_KEY === ''
			)
				return;

			explain(STATUS_DTO.id, openAiContext, setIsTranslateStateLoading);
		}

		function _boost() {
			boost(STATUS_DTO.id, setIsBoostStatePending);
		}

		function reply() {
			PostComposerTextSeedRef.current = null;
			ParentRef.current = dto;
			RootRef.current = dto.rootPost;

			setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
			updateBottomSheetRequestId();
			setBottomSheetVisible(true);
		}

		function OnTranslationClicked() {
			if (IsTranslateStateLoading) return;
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			client.instances
				.getTranslation(dto.id, 'en')
				.then((res) => {
					console.log(res);
				})
				.catch((e) => {
					console.log(e);
				});
		}

		function onMoreActionsPressed() {
			PostRef.current = dto;
			timelineDataPostListReducer.current = getPostListReducer();

			setType(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS);
			updateBottomSheetRequestId();
			setBottomSheetVisible(true);
		}

		return (
			<View
				style={{
					paddingHorizontal: 4,
				}}
			>
				<PostStats dto={dto} />
				<View
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: 4,
					}}
				>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<PostActionButtonToggleLike
							id={STATUS_DTO.id}
							flag={IS_LIKED}
							isFinal={true}
						/>

						<TouchableOpacity
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 14,
								paddingTop: 8,
								paddingBottom: 8,
								position: 'relative',
							}}
							onPress={_boost}
						>
							{IsBoostStatePending ? (
								<ActivityIndicator size={'small'} />
							) : (
								<AntDesign
									name="retweet"
									size={ICON_SIZE}
									color={IS_BOOSTED ? '#8eb834' : colorScheme.textColor.medium}
								/>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 16,
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={reply}
						>
							<FontAwesome5
								name="comment"
								size={ICON_SIZE}
								color={colorScheme.textColor.medium}
							/>
						</TouchableOpacity>

						<BoostAdvanced
							IsVisible={BoostOptionsVisible}
							setIsVisible={setBoostOptionsVisible}
						/>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<PostActionButtonToggleBookmark
							id={STATUS_DTO.id}
							flag={IS_BOOKMARKED}
							isFinal={STATUS_DTO.state.isBookmarkStateFinal}
						/>

						{/*<TouchableOpacity*/}
						{/*	style={{*/}
						{/*		marginRight: 20,*/}
						{/*		paddingTop: 8,*/}
						{/*		paddingBottom: 8,*/}
						{/*	}}*/}
						{/*	onPress={OnTranslationClicked}*/}
						{/*	onLongPress={onTranslationLongPress}*/}
						{/*>*/}
						{/*	{IsTranslateStateLoading ? (*/}
						{/*		<ActivityIndicator size={'small'} color="#988b3b" />*/}
						{/*	) : (*/}
						{/*		<Ionicons*/}
						{/*			color={IS_TRANSLATED ? '#db9a6b' : '#888'}*/}
						{/*			style={{ opacity: IS_TRANSLATED ? 0.8 : 1 }}*/}
						{/*			name={'language-outline'}*/}
						{/*			size={ICON_SIZE + 8}*/}
						{/*		/>*/}
						{/*	)}*/}
						{/*</TouchableOpacity>*/}
						<TouchableOpacity
							style={{
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={onMoreActionsPressed}
						>
							<Ionicons
								name="ellipsis-horizontal"
								size={ICON_SIZE + 2}
								color={colorScheme.textColor.medium}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<Divider
					color={'#cccccc'}
					style={{
						opacity: 0.3,
						marginTop: 8,
					}}
				/>
			</View>
		);
	},
);

export default StatusInteraction;
