import { Ionicons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	StyleSheet,
} from 'react-native';
import { OpenAiService } from '../../../../services/openai.service';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useActivitypubStatusContext } from '../../../../states/useStatus';
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
import useBookmark from '../api/useBookmark';
import useBoost from '../api/useBoost';

type StatusInteractionProps = {
	setExplanationObject: React.Dispatch<React.SetStateAction<string | null>>;
	ExplanationObject: string | null;
	openAiContext?: string[];
	isRepost: boolean;
};

const ICON_SIZE = 18;

function StatusInteractionBase({
	openAiContext,
	setExplanationObject,
	ExplanationObject,
	isRepost,
}: StatusInteractionProps) {
	const { client } = useActivityPubRestClientContext();
	const { status: post, sharedStatus } = useActivitypubStatusContext();
	const _status = isRepost ? sharedStatus : post;
	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();
	const { globalDb } = useGlobalMmkvContext();

	// Loading States
	const [TranslationLoading, setTranslationLoading] = useState(false);

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
		if (TranslationLoading) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		client.instances
			.getTranslation(_status.getId(), 'en')
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	const {
		onPress: onBookmarkPress,
		IsLoading: IsBookmarkLoading,
		IsBookmarked,
	} = useBookmark();
	const {
		IsBoosted,
		IsLoading: IsBoostLoading,
		onPress: onBoostPress,
	} = useBoost();

	function onShowAdvancedMenuPressed() {
		try {
			GlobalMmkvCacheService.setBottomSheetProp_Status(
				globalDb,
				_status.getRaw(),
			);
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
			<PostStats isRepost={isRepost} />
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
							style={[
								styles.buttonText,
								{
									color: '#888',
								},
							]}
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
						onPress={onBoostPress}
						// onLongPress={onBoostLongPressed}
					>
						{IsBoostLoading ? (
							<ActivityIndicator size={'small'} />
						) : (
							<Ionicons
								color={
									IsBoosted ? APP_THEME.REPLY_THREAD_COLOR_SWATCH[1] : '#888'
								}
								name={'rocket-outline'}
								size={ICON_SIZE}
							/>
						)}
						<Text
							style={[
								styles.buttonText,
								{
									color: IsBoosted
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
						onPress={onBookmarkPress}
						// onLongPress={onSaveLongPress}
					>
						{IsBookmarkLoading ? (
							<ActivityIndicator size={'small'} />
						) : (
							<Ionicons
								color={IsBookmarked ? APP_THEME.INVALID_ITEM : '#888'}
								name={'bookmark-outline'}
								size={ICON_SIZE}
							/>
						)}
						<Text
							style={[
								styles.buttonText,
								{
									color: IsBookmarked ? APP_THEME.INVALID_ITEM : '#888',
								},
							]}
						>
							{_status?.getIsBookmarked() ? 'Saved' : 'Save'}
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

const styles = StyleSheet.create({
	buttonText: {
		marginLeft: 8,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	},
});

const StatusInteraction = memo(StatusInteractionBase);
export default StatusInteraction;
