import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import PostActionButtonToggleBookmark from '#/components/common/status/fragments/modules/PostActionButtonToggleBookmark';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { withPostItemContext } from '#/components/containers/WithPostItemContext';
import { AppToggleIcon } from '#/components/lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import { ActivityPubService, PostInspector } from '@dhaaga/bridge';
import PostInteractionStatsRow from '#/features/post-item-view/views/PostInteractionStatsRow';
import DhaagaSkinnedIcon, {
	APP_ICON_IDENTIFIER,
} from '#/features/skins/components/ThemedAppIcons';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { AppDividerSoft } from '#/ui/Divider';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBus';

/**
 * Press this to toggle sharing status
 */
function ShareButton() {
	const { theme } = useAppTheme();
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { postEventBus } = useAppPublishers();
	const { driver } = useAppApiClient();

	async function onPress() {
		postEventBus.toggleShare(item.uuid, setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
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
			{IsLoading ? (
				<ActivityIndicator color={theme.primary} />
			) : FLAG ? (
				<DhaagaSkinnedIcon id={APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_ACTIVE} />
			) : (
				<DhaagaSkinnedIcon
					id={APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_INACTIVE}
				/>
			)}
		</Pressable>
	);
}

/**
 * Press this to toggle like
 */
function LikeButton() {
	const { theme } = useAppTheme();
	const { dto: item } = withPostItemContext();
	const [IsLoading, setIsLoading] = useState(false);
	const { toggleLike } = usePostEventBusActions(item.uuid);
	async function onPress() {
		toggleLike(setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
	}

	const FLAG = PostInspector.isLiked(item);

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
			{IsLoading ? (
				<ActivityIndicator color={theme.primary} />
			) : FLAG ? (
				<DhaagaSkinnedIcon id={APP_ICON_IDENTIFIER.LIKE_INDICATOR_ACTIVE} />
			) : (
				<DhaagaSkinnedIcon id={APP_ICON_IDENTIFIER.LIKE_INDICATOR_INACTIVE} />
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
			<DhaagaSkinnedIcon id={APP_ICON_IDENTIFIER.POST_REPLY_BUTTON} />
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

function PostActionButtonRowView() {
	const { dto } = withPostItemContext();
	const _dto = PostInspector.getContentTarget(dto);
	return (
		<View style={{ marginTop: 8 }}>
			<PostInteractionStatsRow dto={_dto} />
			<AppDividerSoft style={{ marginVertical: 2 }} />
			<StatusInteractionButtons />
		</View>
	);
}

export default PostActionButtonRowView;

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
		width: appDimensions.timelines.actionButtonSize + 6 * 2,
		height: appDimensions.timelines.actionButtonSize + 4 + 8,
	},
});
