import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import PostActionButtonToggleBookmark from '#/components/common/status/fragments/modules/PostActionButtonToggleBookmark';
import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';
import { AppToggleIcon } from '#/components/lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/_global';
import { PostInspector } from '@dhaaga/bridge';
import PostInteractionStatsRow from '#/features/post-view/views/PostInteractionStatsRow';

/**
 * Press this to toggle sharing status
 */
function ShareButton() {
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { postObjectActions } = useAppPublishers();
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	async function onPress() {
		await postObjectActions.toggleShare(item.uuid, setIsLoading);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
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
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { postObjectActions } = useAppPublishers();
	const { theme } = useAppTheme();

	async function onPress() {
		await postObjectActions.toggleLike(item.uuid, setIsLoading);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
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
			onPress={onPress}
			count={COUNT}
		/>
	);
}

/**
 * Press this to open composer (reply mode)
 */
function CommentButton() {
	const { dto: item } = withPostItemContext();
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
	const { dto: item } = withPostItemContext();
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
	const { dto: item } = withPostItemContext();
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

function PostActionRow() {
	const { dto } = withPostItemContext();
	const _dto = PostInspector.getContentTarget(dto);
	return (
		<View style={{ marginTop: 8 }}>
			<PostInteractionStatsRow dto={_dto} />
			<StatusInteractionButtons />
		</View>
	);
}

export default PostActionRow;

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
