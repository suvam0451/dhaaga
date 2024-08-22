import { Ionicons } from '@expo/vector-icons';
import { memo, useEffect, useState } from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	StyleSheet,
} from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Divider } from '@rneui/themed';
import PostStats from '../PostStats';
import * as Haptics from 'expo-haptics';
import { APP_THEME } from '../../../../styles/AppTheme';
import BoostAdvanced from '../../../dialogs/BoostAdvanced';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../../states/useGorhomBottomSheet';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import GlobalMmkvCacheService from '../../../../services/globalMmkvCache.services';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTimelineDataContext } from '../../timeline/api/useTimelineData';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import { useAppBottomSheet } from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';

type StatusInteractionProps = {
	openAiContext?: string[];
	dto: ActivityPubStatusAppDtoType;
};

const ICON_SIZE = 18;

const StatusInteraction = memo(
	({ openAiContext, dto }: StatusInteractionProps) => {
		const {
			setVisible: setBottomSheetVisible,
			setType,
			PostComposerTextSeedRef,
			replyToRef,
			updateRequestId: updateBottomSheetRequestId,
		} = useAppBottomSheet();
		const { client } = useActivityPubRestClientContext();
		const { setVisible, setBottomSheetType, updateRequestId } =
			useGorhomActionSheetContext();
		const { globalDb } = useGlobalMmkvContext();
		const { toggleBookmark, explain, boost, getBookmarkState } =
			useAppTimelineDataContext();

		const STATUS_DTO = dto;

		// local state
		const IS_BOOKMARKED = STATUS_DTO.interaction.bookmarked;
		const IS_TRANSLATED =
			STATUS_DTO.calculated.translationOutput !== undefined &&
			STATUS_DTO.calculated.translationOutput !== null;
		const IS_BOOSTED = dto.interaction.boosted;

		// loading state
		const [IsBookmarkStatePending, setIsBookmarkStatePending] = useState(false);
		const [IsTranslateStateLoading, setIsTranslateStateLoading] =
			useState(false);
		const [IsBoostStatePending, setIsBoostStatePending] = useState(false);

		const [BoostOptionsVisible, setBoostOptionsVisible] = useState(false);

		// helper functions
		function _toggleBookmark() {
			toggleBookmark(STATUS_DTO.id, setIsBookmarkStatePending);
		}

		function onTranslationLongPress() {
			explain(STATUS_DTO.id, openAiContext, setIsTranslateStateLoading);
		}

		function _boost() {
			boost(STATUS_DTO.id, setIsBoostStatePending);
		}

		function onClickReply() {
			PostComposerTextSeedRef.current = null;
			replyToRef.current = dto;

			setType(BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
			updateBottomSheetRequestId();
			setBottomSheetVisible(true);
		}

		useEffect(() => {
			if (!STATUS_DTO.state.isBookmarkStateFinal) {
				getBookmarkState(STATUS_DTO.id, setIsBookmarkStatePending);
			}
		}, [STATUS_DTO]);

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

		// const {
		// 	IsBoosted,
		// 	IsLoading: IsBoostLoading,
		// 	onPress: onBoostPress,
		// } = useBoost();

		function onShowAdvancedMenuPressed() {
			try {
				GlobalMmkvCacheService.setBottomSheetProp_Status(globalDb, dto);
				setBottomSheetType(BOTTOM_SHEET_ENUM.STATUS_MENU);
				updateRequestId();
				setVisible(true);
			} catch (e) {
				console.log('[WARN]: gorhom bottom sheet context not available');
			}
		}

		return (
			<View
				style={{
					paddingHorizontal: 4,
				}}
			>
				<PostStats dto={dto} />
				<Divider
					color={'#cccccc'}
					style={{
						opacity: 0.3,
						marginTop: 8,
					}}
				/>
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
						<TouchableOpacity
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 12,
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={onClickReply}
						>
							<FontAwesome5 name="comment" size={ICON_SIZE} color="#888" />
							<Text
								style={[
									styles.buttonText,
									{
										color: '#888',
									},
								]}
							>
								Reply
							</Text>
						</TouchableOpacity>

						<BoostAdvanced
							IsVisible={BoostOptionsVisible}
							setIsVisible={setBoostOptionsVisible}
						/>
						<TouchableOpacity
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 12,
								paddingTop: 8,
								paddingBottom: 8,
								position: 'relative',
							}}
							onPress={_boost}
						>
							{IsBoostStatePending ? (
								<ActivityIndicator size={'small'} />
							) : (
								<Ionicons
									color={
										IS_BOOSTED ? APP_THEME.REPLY_THREAD_COLOR_SWATCH[1] : '#888'
									}
									name={'rocket-outline'}
									size={ICON_SIZE}
								/>
							)}
							<Text
								style={[
									styles.buttonText,
									{
										color: IS_BOOSTED
											? APP_THEME.REPLY_THREAD_COLOR_SWATCH[1]
											: '#888',
									},
								]}
							>
								Boost
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 8,
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={_toggleBookmark}
						>
							{IsBookmarkStatePending ? (
								<ActivityIndicator size={'small'} />
							) : (
								<Ionicons
									color={IS_BOOKMARKED ? APP_THEME.INVALID_ITEM : '#888'}
									name={'bookmark-outline'}
									size={ICON_SIZE}
								/>
							)}
							<Text
								style={[
									styles.buttonText,
									{
										color: IS_BOOKMARKED ? APP_THEME.INVALID_ITEM : '#888',
									},
								]}
							>
								{IS_BOOKMARKED ? 'Saved' : 'Save'}
							</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							style={{
								marginRight: 20,
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={OnTranslationClicked}
							onLongPress={onTranslationLongPress}
						>
							{IsTranslateStateLoading ? (
								<ActivityIndicator size={'small'} color="#988b3b" />
							) : (
								<Ionicons
									color={IS_TRANSLATED ? '#db9a6b' : '#888'}
									style={{ opacity: IS_TRANSLATED ? 0.8 : 1 }}
									name={'language-outline'}
									size={ICON_SIZE + 8}
								/>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								paddingTop: 8,
								paddingBottom: 8,
							}}
							onPress={onShowAdvancedMenuPressed}
						>
							<Ionicons
								name="ellipsis-horizontal"
								size={ICON_SIZE + 8}
								color="#888"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	},
);

const styles = StyleSheet.create({
	buttonText: {
		marginLeft: 8,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	},
});

export default StatusInteraction;
