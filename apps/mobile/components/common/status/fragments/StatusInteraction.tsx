import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import PostActionButtonToggleBookmark from './modules/PostActionButtonToggleBookmark';
import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { AppToggleIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../states/_global';
import { PostInspector } from '@dhaaga/bridge';

/**
 * Press this to toggle sharing status
 */
function ShareButton() {
	const { dto: item } = useAppStatusItem();
	const [IsLoading, setIsLoading] = useState(false);
	const { postPub } = useAppPublishers();
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	async function onPress() {
		postPub.toggleShare(item.uuid, setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
	}

	const FLAG = PostInspector.isShared(item);
	const _target = PostInspector.getContentTarget(item);
	const COUNT = _target.stats.boostCount;

	const canLike = ActivityPubService.canLike(driver);
	return (
		<AppToggleIcon
			flag={FLAG}
			activeIconId={'sync-outline'}
			inactiveIconId={'sync-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a40}
			size={appDimensions.timelines.actionButtonSize}
			style={[
				styles.actionButton,
				{
					paddingLeft: canLike ? 6 : 0,
				},
			]}
			onPress={onPress}
			count={COUNT}
		/>
	);
}

/**
 * Press this to toggle like
 */
function LikeButton() {
	const { dto: item } = useAppStatusItem();
	const [IsLoading, setIsLoading] = useState(false);
	const { postPub } = useAppPublishers();
	const { theme } = useAppTheme();

	async function _toggleLike() {
		postPub.toggleLike(item.uuid, setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
	}

	const FLAG = PostInspector.isLiked(item);
	const _target = PostInspector.getContentTarget(item);
	const COUNT = _target.stats.likeCount;

	return (
		<AppToggleIcon
			flag={FLAG}
			activeIconId={'heart'}
			inactiveIconId={'heart-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a40}
			size={appDimensions.timelines.actionButtonSize}
			style={[
				styles.actionButton,
				{
					marginLeft: -6,
				},
			]}
			onPress={_toggleLike}
			count={COUNT}
		/>
	);
}

/**
 * Press this to open composer (reply mode)
 */
function CommentButton() {
	const { dto: item } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

	function onPress() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	const _target = PostInspector.getContentTarget(item);
	const COUNT = _target.stats.replyCount;

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'chatbox-outline'}
			inactiveIconId={'chatbox-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a40}
			size={appDimensions.timelines.actionButtonSize}
			style={styles.actionButton}
			onPress={onPress}
			count={COUNT}
		/>
	);
}

function ReactButton() {
	const { dto: item } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

	function onPress() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.ADD_REACTION, true);
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'smiley'}
			inactiveIconId={'smiley-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a40}
			size={appDimensions.timelines.actionButtonSize}
			style={styles.actionButton}
			onPress={onPress}
		/>
	);
}

function SettingsButton() {
	const { dto: item } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();
	const { acct } = useAppAcct();

	const _target = PostInspector.getContentTarget(item);
	if (_target.postedBy.id !== acct.identifier) return <View />;

	function onPress() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.ADD_REACTION, true);
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'settings'}
			inactiveIconId={'settings-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.primary.a0}
			size={appDimensions.timelines.actionButtonSize}
			style={styles.actionButton}
			onPress={onPress}
		/>
	);
}

function StatusInteractionButtons() {
	const { driver } = useAppApiClient();
	const IS_MISSKEY = ActivityPubService.misskeyLike(driver);
	return (
		<View style={styles.interactionButtonSection}>
			<View style={{ flexDirection: 'row' }}>
				{!IS_MISSKEY && <LikeButton />}
				<ShareButton />
				<CommentButton />
				{IS_MISSKEY && <ReactButton />}
				<SettingsButton />
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
	const { dto } = useAppStatusItem();
	const _dto = PostInspector.getContentTarget(dto);
	return (
		<View>
			{/*<PostStats dto={_dto} />*/}
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
	},
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingTop: 8,
		paddingHorizontal: 6,
	},
});
