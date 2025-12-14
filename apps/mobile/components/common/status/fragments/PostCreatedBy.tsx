import {
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useRef } from 'react';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import useAppNavigator from '#/states/useAppNavigator';
import { AccountSavedUser } from '@dhaaga/db';
import type { AppParsedTextNodes, PostObjectType } from '@dhaaga/bridge';
import { AppText } from '../../../lib/Text';
import { RandomUtil, ActivityPubService } from '@dhaaga/bridge';
import { TextNodeParser } from '@dhaaga/bridge';
import OriginalPosterDecoration from '#/skins/OriginalPosterDecoration';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import TextAstRendererView from '#/ui/TextAstRendererView';

const TIMELINE_PFP_SIZE = 40; // appDimensions.timelines.avatarIconSize;

/**
 * Renders the user (poster)'s avatar
 */
export function OriginalPostedPfpFragment({
	url,
	onClick,
}: {
	url: string;
	onClick: () => void;
}) {
	return (
		<TouchableOpacity
			onPress={onClick}
			style={{
				width: TIMELINE_PFP_SIZE,
				height: TIMELINE_PFP_SIZE,
				borderColor: 'rgba(200, 200, 200, 0.3)',
				borderWidth: 1,
				borderRadius: TIMELINE_PFP_SIZE / 2,
				marginTop: 2,
				flexShrink: 1,
			}}
		>
			{/* @ts-ignore */}
			<Image
				style={{
					flex: 1,
					backgroundColor: '#0553',
					padding: 2,
					borderRadius: TIMELINE_PFP_SIZE / 2,
					overflow: 'hidden',
				}}
				source={{ uri: url }}
			/>
		</TouchableOpacity>
	);
}

export function OriginalPosterPostedByFragment({
	displayNameParsed,
	onClick,
	emojiMap,
	handle,
}: {
	displayNameParsed: AppParsedTextNodes;
	onClick: () => void;
	emojiMap?: Map<string, string>;
	handle: string;
	visibility: string;
	postedAt: Date;
}) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				alignItems: 'flex-start',
				marginLeft: 8, // to leave sufficient space to show indicator icons
				marginRight: 48,
			}}
		>
			<View>
				<Pressable onPress={onClick}>
					<TextAstRendererView
						tree={
							displayNameParsed.length === 0
								? [{ uuid: RandomUtil.nanoId(), type: 'para', nodes: [] }]
								: displayNameParsed
						}
						variant={'displayName'}
						mentions={[]}
						emojiMap={emojiMap}
						oneLine
					/>
					<AppText.Normal
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
							maxWidth: 196,
						}}
						numberOfLines={1}
					>
						{handle}
					</AppText.Normal>
				</Pressable>
			</View>
		</View>
	);
}

type SavedPostCreatedByProps = {
	user: AccountSavedUser;
	authoredAt: Date | string;
	style?: StyleProp<ViewStyle>;
};

/**
 * Author indicator for a post
 *
 * The local version must check online
 * connectivity and resolve the handle
 * prior t show information
 * @constructor
 */
export function SavedPostCreatedBy({
	user,
	style,
	authoredAt,
}: SavedPostCreatedByProps) {
	const { driver } = useAppApiClient();
	const UserDivRef = useRef(null);

	// resolve handle and show modal
	function onAvatarClicked() {}

	// redirect to profile
	function onProfilePressed() {}

	if (!user) return <View />;
	return (
		<View
			style={[
				{
					alignItems: 'center',
					flexDirection: 'row',
					flexGrow: 1,
					width: 'auto',
					position: 'relative',
				},
				style,
			]}
		>
			<View ref={UserDivRef}>
				<TouchableOpacity
					onPress={onAvatarClicked}
					style={{
						width: TIMELINE_PFP_SIZE,
						height: TIMELINE_PFP_SIZE,
						borderColor: 'rgba(200, 200, 200, 0.3)',
						borderWidth: 1,
						borderRadius: TIMELINE_PFP_SIZE / 2,
						flexShrink: 1,
					}}
				>
					<Image
						style={{
							flex: 1,
							padding: 2,
							borderRadius: TIMELINE_PFP_SIZE / 2,
						}}
						source={{ uri: user.avatarUrl }}
						onError={() => {}}
					/>
				</TouchableOpacity>
			</View>

			<OriginalPosterPostedByFragment
				onClick={onProfilePressed}
				displayNameParsed={TextNodeParser.parse(driver, user.displayName)}
				handle={user.username}
				postedAt={new Date(authoredAt)}
				visibility={'N/A'}
				emojiMap={new Map()}
			/>
		</View>
	);
}

type OriginalPosterProps = {
	style?: StyleProp<ViewStyle>;
	// pass by reference to avoid incorrect author
	post: PostObjectType;
};

/**
 * This is the author indicator for
 * the bottom-most post-item
 */
function PostCreatedBy({ style, post }: OriginalPosterProps) {
	const { show } = useAppBottomSheet();
	const { toProfile } = useAppNavigator();
	const { driver } = useAppApiClient();

	const UserDivRef = useRef(null);

	function onAvatarClicked() {
		let ctx = null;
		if (ActivityPubService.blueskyLike(driver)) {
			ctx = {
				$type: 'user-preview',
				use: 'did',
				did: post?.postedBy?.id,
			};
		} else {
			ctx = {
				$type: 'user-preview',
				use: 'userId',
				userId: post?.postedBy?.id,
			};
		}
		show(APP_BOTTOM_SHEET_ENUM.USER_PREVIEW, true, ctx);

		// UserDivRef.current.measureInWindow((x, y, width, height) => {
		// 	appManager.storage.setUserPeekModalData(STATUS_DTO.postedBy.id, {
		// 		x,
		// 		y,
		// 		width,
		// 		height,
		// 	});
		// 	refresh();
		// 	setTimeout(() => {
		// 		show();
		// 	}, 100);
		// });
	}

	function onProfileClicked() {
		toProfile(post?.postedBy?.id);
	}

	return (
		<View style={[styles.authorContainerRoot, style]}>
			<View ref={UserDivRef}>
				<TouchableOpacity
					onPress={onAvatarClicked}
					style={styles.authorAvatarContainer}
				>
					<OriginalPosterDecoration uri={post.postedBy.avatarUrl} />
				</TouchableOpacity>
			</View>

			<OriginalPosterPostedByFragment
				onClick={onProfileClicked}
				displayNameParsed={post.postedBy.parsedDisplayName}
				handle={post.postedBy.handle}
				postedAt={new Date(post.createdAt)}
				visibility={post.visibility}
				emojiMap={post.calculated.emojis}
			/>
		</View>
	);
}

export default PostCreatedBy;

const styles = StyleSheet.create({
	authorContainerRoot: {
		alignItems: 'center',
		flexDirection: 'row',
		flexGrow: 1,
		width: 'auto',
		position: 'relative',
	}, // with border decoration
	authorAvatarContainer: {
		width: TIMELINE_PFP_SIZE,
		height: TIMELINE_PFP_SIZE,
		borderColor: 'rgba(200, 200, 200, 0.3)',
		borderWidth: 1,
		borderRadius: TIMELINE_PFP_SIZE / 2,
		flexShrink: 1,
	},
});
