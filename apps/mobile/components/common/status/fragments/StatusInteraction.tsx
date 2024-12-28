import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import PostStats from '../PostStats';
import * as Haptics from 'expo-haptics';
import BoostAdvanced from '../../../dialogs/BoostAdvanced';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import PostActionButtonToggleBookmark from './modules/PostActionButtonToggleBookmark';
import PostActionButtonToggleLike from './modules/PostActionButtonToggleLike';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';
import {
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';

const ICON_SIZE = 28;

function StatusInteractionButtons() {
	const { dto: item } = useAppStatusItem();
	const { explain } = useAppTimelinePosts();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { theme } = useAppTheme();
	const { client } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
		})),
	);
	const { postPub } = useAppPublishers();
	const [IsLoading, setIsLoading] = useState(false);

	async function _boost() {
		await postPub.toggleShare(item.uuid, setIsLoading);
	}

	function reply() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
		// setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		// updateBottomSheetRequestId();
		// setBottomSheetVisible(true);
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
	const IS_BOOSTED = item.interaction.boosted;

	// loading state
	const [IsTranslateStateLoading, setIsTranslateStateLoading] = useState(false);
	const [IsBoostStatePending, setIsBoostStatePending] = useState(false);

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

	const INACTIVE_TINT = theme.secondary.a10;

	return (
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
				<PostActionButtonToggleLike />
				<TouchableOpacity
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 16,
						paddingTop: 8,
						paddingBottom: 8,
						position: 'relative',
					}}
					onPress={_boost}
				>
					{IsBoostStatePending ? (
						<ActivityIndicator size={'small'} />
					) : IS_BOOSTED ? (
						<Ionicons
							name="sync-outline"
							size={ICON_SIZE}
							color={theme.primary.a0}
						/>
					) : (
						<Ionicons
							name="sync-outline"
							size={ICON_SIZE}
							color={IS_BOOSTED ? '#8eb834' : INACTIVE_TINT}
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
					<Ionicons
						name="chatbox-outline"
						size={ICON_SIZE}
						color={INACTIVE_TINT}
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
