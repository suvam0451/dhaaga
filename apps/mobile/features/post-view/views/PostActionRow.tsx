import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable, View, StyleSheet } from 'react-native';
import PostActionButtonToggleBookmark from '#/components/common/status/fragments/modules/PostActionButtonToggleBookmark';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';
import { AppToggleIcon } from '#/components/lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import { ActivityPubService, PostInspector } from '@dhaaga/bridge';
import PostInteractionStatsRow from '#/features/post-view/views/PostInteractionStatsRow';
import DhaagaSkinnedIcon, { DHAAGA_SKINNED_ICON_ID } from '#/skins/_icons';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

/**
 * Press this to toggle sharing status
 */
function ShareButton() {
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { postObjectActions } = useAppPublishers();
	const { driver } = useAppApiClient();

	async function onPress() {
		await postObjectActions.toggleShare(item.uuid, setIsLoading);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	const FLAG = PostInspector.isShared(item);

	const canLike = ActivityPubService.canLike(driver);
	return (
		<Pressable
			style={[
				styles.actionButton,
				{
					paddingLeft: canLike ? 6 : 0,
				},
			]}
			onPress={onPress}
		>
			{FLAG ? (
				<DhaagaSkinnedIcon
					id={DHAAGA_SKINNED_ICON_ID.POST_SHARE_BUTTON_ACTIVE}
				/>
			) : (
				<DhaagaSkinnedIcon
					id={DHAAGA_SKINNED_ICON_ID.POST_SHARE_BUTTON_INACTIVE}
				/>
			)}
		</Pressable>
	);
}

/**
 * Press this to toggle like
 */
function LikeButton() {
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { postObjectActions } = useAppPublishers();

	async function onPress() {
		await postObjectActions.toggleLike(item.uuid, setIsLoading);
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
	}

	const FLAG = PostInspector.isLiked(item);
	const _target = PostInspector.getContentTarget(item);

	return (
		<Pressable
			style={[
				styles.actionButton,
				{
					marginLeft: -6,
				},
			]}
			onPress={onPress}
		>
			{FLAG ? (
				<DhaagaSkinnedIcon id={DHAAGA_SKINNED_ICON_ID.LIKE_INDICATOR_ACTIVE} />
			) : (
				<DhaagaSkinnedIcon
					id={DHAAGA_SKINNED_ICON_ID.LIKE_INDICATOR_INACTIVE}
				/>
			)}
		</Pressable>
	);
}

/**
 * Press this to open composer (reply mode)
 */
function CommentButton() {
	const { dto: item } = withPostItemContext();
	const { show } = useAppBottomSheet();

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true, {
			$type: 'compose-reply',
			parentPostId: item.id,
		});
	}

	return (
		<Pressable style={styles.actionButton} onPress={onPress}>
			<DhaagaSkinnedIcon id={DHAAGA_SKINNED_ICON_ID.POST_REPLY_BUTTON} />
		</Pressable>
	);
}

function ReactButton() {
	const { dto: item } = withPostItemContext();
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_REACTION, true, {
			$type: 'post-id',
			postId: item.id,
		});
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'smiley'}
			inactiveIconId={'smiley-outline'}
			activeTint={theme.primary}
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
	const { show } = useAppBottomSheet();
	const { acct } = useActiveUserSession();

	const _target = PostInspector.getContentTarget(item);
	if (_target.postedBy.id !== acct.identifier) return <View />;

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_REACTION, true, {
			$type: 'post-id',
			postId: item.id,
		});
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'settings'}
			inactiveIconId={'settings-outline'}
			activeTint={theme.primary}
			inactiveTint={theme.primary}
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
