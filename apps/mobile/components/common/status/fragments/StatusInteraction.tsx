import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PostStats from '../PostStats';
import * as Haptics from 'expo-haptics';
import BoostAdvanced from '../../../dialogs/BoostAdvanced';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import PostActionButtonToggleBookmark from './modules/PostActionButtonToggleBookmark';
import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';
import { AppToggleIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';

function StatusInteractionButtons() {
	const { dto: item } = useAppStatusItem();
	const { explain } = useAppTimelinePosts();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { theme } = useAppTheme();
	const { client } = useAppApiClient();
	const { postPub } = useAppPublishers();
	const [IsLoading, setIsLoading] = useState(false);

	async function _boost() {
		await postPub.toggleShare(item.uuid, setIsLoading);
	}

	function reply() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	async function _toggleLike() {
		await postPub.toggleLike(item.uuid, setIsLoading);
	}

	function OnTranslationClicked() {
		if (IsTranslateStateLoading) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		client.instances
			.getTranslation(item.id, 'en')
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	const IS_TRANSLATED =
		item.calculated.translationOutput !== undefined &&
		item.calculated.translationOutput !== null;

	// loading state
	const [IsTranslateStateLoading, setIsTranslateStateLoading] = useState(false);
	const [BoostOptionsVisible, setBoostOptionsVisible] = useState(false);

	function onTranslationLongPress() {
		// TODO: implement instance translation
		//  + fedilab libre translate endpoint.
		if (
			!process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
			process.env.EXPO_PUBLIC_OPENAI_API_KEY === ''
		)
			return;

		explain(item.id, null, setIsTranslateStateLoading);
	}

	const FLAG_LIKE = item.interaction.liked;
	const FLAG_SHARED = item.interaction.boosted;

	return (
		<View style={styles.interactionButtonSection}>
			<View style={{ flexDirection: 'row' }}>
				<AppToggleIcon
					flag={FLAG_LIKE}
					activeIconId={'heart'}
					inactiveIconId={'heart-outline'}
					activeTint={theme.primary.a0}
					inactiveTint={theme.secondary.a10}
					size={appDimensions.timelines.actionButtonSize}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 8,
						paddingBottom: 8,
						paddingHorizontal: 6,
					}}
					onPress={_toggleLike}
				/>

				<AppToggleIcon
					flag={FLAG_SHARED}
					activeIconId={'sync-outline'}
					inactiveIconId={'sync-outline'}
					activeTint={theme.primary.a0}
					inactiveTint={theme.secondary.a10}
					size={appDimensions.timelines.actionButtonSize}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 8,
						paddingBottom: 8,
						paddingHorizontal: 6,
					}}
					onPress={_boost}
				/>
				<AppToggleIcon
					flag={false}
					activeIconId={'chatbox-outline'}
					inactiveIconId={'chatbox-outline'}
					activeTint={theme.primary.a0}
					inactiveTint={theme.secondary.a10}
					size={appDimensions.timelines.actionButtonSize}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 8,
						paddingBottom: 8,
						paddingHorizontal: 6,
					}}
					onPress={reply}
				/>
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
				<PostActionButtonToggleBookmark />
			</View>
		</View>
	);
}

function StatusInteraction() {
	return (
		<View
			style={{
				paddingHorizontal: 4,
			}}
		>
			<PostStats />
			<StatusInteractionButtons />
		</View>
	);
}

export default StatusInteraction;

const styles = StyleSheet.create({
	interactionButtonSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},
});
