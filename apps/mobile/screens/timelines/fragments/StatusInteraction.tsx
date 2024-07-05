import { Ionicons } from '@expo/vector-icons';
import { memo, useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import { OpenAiService } from '../../../services/openai.service';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Divider } from '@rneui/themed';
import PostStats from '../../../components/common/status/PostStats';
import * as Haptics from 'expo-haptics';
import { APP_THEME } from '../../../styles/AppTheme';
import StatusService from '../../../services/status.service';
import BoostAdvanced from '../../../components/dialogs/BoostAdvanced';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import useGlobalMMkvCache, {
	useGlobalMmkvContext,
} from '../../../states/useGlobalMMkvCache';
import GlobalMmkvCacheService from '../../../services/globalMmkvCache.services';

type StatusInteractionProps = {
	setExplanationObject: React.Dispatch<React.SetStateAction<string | null>>;
	ExplanationObject: string | null;
	openAiContext?: string[];
};

const ICON_SIZE = 18;

function StatusInteractionBase({
	openAiContext,
	setExplanationObject,
	ExplanationObject,
}: StatusInteractionProps) {
	const { client } = useActivityPubRestClientContext();
	const { status: post, setDataRaw } = useActivitypubStatusContext();
	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();
	const { globalDb } = useGlobalMmkvContext();

	// Loading States
	const [TranslationLoading, setTranslationLoading] = useState(false);
	const [SecondCommandLoading, setSecondCommandLoading] = useState(false);

	const [ThirdCommandLoading, setThirdCommandLoading] = useState(false);

	//
	const [BoostOptionsVisible, setBoostOptionsVisible] = useState(false);

	function onTranslationLongPress() {
		if (TranslationLoading || ExplanationObject) return;
		setTranslationLoading(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		OpenAiService.explain(openAiContext.join(','))
			.then((res) => {
				setExplanationObject(res);
			})
			.finally(() => {
				setTranslationLoading(false);
			});
	}

	function OnTranslationClicked() {
		console.log('translation clicked', TranslationLoading);
		if (TranslationLoading) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		client.instance
			.getTranslation(post.getId(), 'en')
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	function onSavePress() {
		if (ThirdCommandLoading) return;

		setThirdCommandLoading(true);
		if (post.getIsBookmarked()) {
			client
				.unBookmark(post.getId())
				.then((res) => {
					setDataRaw(res);
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				})
				.finally(() => {
					setThirdCommandLoading(false);
				});
		} else {
			client
				.bookmark(post.getId())
				.then((res) => {
					setDataRaw(res);
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				})
				.finally(() => {
					setThirdCommandLoading(false);
				});
		}
	}

	function onSaveLongPress() {
		setThirdCommandLoading(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		setThirdCommandLoading(false);
	}

	function onBoostPressed() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		StatusService.toggleBoost(client, post, {
			setIsLoading: setSecondCommandLoading,
			setDataRaw,
		});
	}

	function onBoostLongPressed() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		// setBoostOptionsVisible(true);
	}

	function onShowAdvancedMenuPressed() {
		GlobalMmkvCacheService.setBottomSheetProp_Status(globalDb, post.getRaw());
		setBottomSheetType(BOTTOM_SHEET_ENUM.STATUS_MENU);
		updateRequestId();
		setVisible(true);
	}

	return (
		<View
			style={{
				paddingHorizontal: 4,
			}}
		>
			<PostStats />
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
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginRight: 12,
							paddingTop: 8,
							paddingBottom: 8,
						}}
					>
						<FontAwesome5 name="comment" size={ICON_SIZE} color="#888" />
						<Text
							style={{
								color: '#888',
								marginLeft: 8,
								fontFamily: 'Montserrat-Bold',
							}}
						>
							Reply
						</Text>
					</View>

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
						onPress={onBoostPressed}
						onLongPress={onBoostLongPressed}
					>
						{SecondCommandLoading ? (
							<ActivityIndicator size={'small'} />
						) : (
							<Ionicons
								color={
									post.getIsRebloggedByMe()
										? APP_THEME.REPLY_THREAD_COLOR_SWATCH[1]
										: '#888'
								}
								name={'rocket-outline'}
								size={ICON_SIZE}
							/>
						)}
						<Text
							style={{
								color: post.getIsRebloggedByMe()
									? APP_THEME.REPLY_THREAD_COLOR_SWATCH[1]
									: '#888',
								marginLeft: 8,
								fontFamily: 'Montserrat-Bold',
							}}
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
						onPress={onSavePress}
						onLongPress={onSaveLongPress}
					>
						{ThirdCommandLoading ? (
							<ActivityIndicator size={'small'} />
						) : (
							<Ionicons
								color={
									post?.getIsBookmarked() ? APP_THEME.INVALID_ITEM : '#888'
								}
								name={'bookmark-outline'}
								size={ICON_SIZE}
							/>
						)}
						<Text
							style={{
								marginLeft: 8,
								fontFamily: 'Montserrat-Bold',
								color: post?.getIsBookmarked()
									? APP_THEME.INVALID_ITEM
									: '#888',
							}}
						>
							{post?.getIsBookmarked() ? 'Saved' : 'Save'}
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
						// onLongPress={onTranslationLongPress}
					>
						{TranslationLoading ? (
							<ActivityIndicator size={'small'} color="#988b3b" />
						) : (
							<Ionicons
								color={ExplanationObject !== null ? '#db9a6b' : '#888'}
								style={{ opacity: ExplanationObject !== null ? 0.8 : 1 }}
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
}

const StatusInteraction = memo(StatusInteractionBase);
export default StatusInteraction;
