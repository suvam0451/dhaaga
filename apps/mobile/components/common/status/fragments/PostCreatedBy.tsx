import {
	Pressable,
	StyleProp,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRef } from 'react';
import { APP_KNOWN_MODAL } from '../../../../states/_global';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import {
	useAppManager,
	useAppModalState,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import useAppNavigator from '../../../../states/useAppNavigator';
import { AccountSavedUser } from '../../../../database/_schema';
import { TextContentView } from '../TextContentView';
import { AppParsedTextNodes } from '../../../../types/parsed-text.types';
import MfmService from '../../../../services/mfm.service';
import { AppText } from '../../../lib/Text';

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
	postedAt,
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
					<TextContentView
						tree={displayNameParsed}
						variant={'displayName'}
						mentions={[]}
						emojiMap={emojiMap}
						oneLine
					/>
					<AppText.Normal
						style={{
							color: theme.secondary.a40,
							fontSize: 12,
							maxWidth: 196,
						}}
						numberOfLines={1}
					>
						{handle} • {DatetimeUtil.timeAgo(postedAt)}
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
	const UserDivRef = useRef(null);

	// resolve handle and show modal
	function onAvatarClicked() {}

	// redirect to profile
	function onProfilePressed() {}

	const _displayNameParsed = MfmService.renderMfm(user.displayName, {
		emojiMap: new Map(),
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
		colorScheme: null,
		variant: 'displayName',
		nonInteractive: false,
	});

	if (!user) return <View />;
	return (
		<View
			style={[
				{
					alignItems: 'center',
					flexDirection: 'row',
					flexGrow: 1,
					overflowX: 'hidden',
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
					{/* @ts-ignore */}
					<Image
						style={{
							flex: 1,
							padding: 2,
							borderRadius: TIMELINE_PFP_SIZE / 2,
						}}
						source={{ uri: user.avatarUrl }}
					/>
				</TouchableOpacity>
			</View>

			<OriginalPosterPostedByFragment
				onClick={onProfilePressed}
				displayNameParsed={_displayNameParsed?.parsed || []}
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
};

/**
 * This is the author indicator for
 * the bottom-most post item
 */
function PostCreatedBy({ style }: OriginalPosterProps) {
	const { appManager } = useAppManager();
	const { show, refresh } = useAppModalState(APP_KNOWN_MODAL.USER_PEEK);
	const { dto } = useAppStatusItem();
	const STATUS_DTO = PostMiddleware.getContentTarget(dto);
	const { toProfile } = useAppNavigator();

	const UserDivRef = useRef(null);

	function onAvatarClicked() {
		UserDivRef.current.measureInWindow((x, y, width, height) => {
			appManager.storage.setUserPeekModalData(STATUS_DTO.postedBy.userId, {
				x,
				y,
				width,
				height,
			});
			refresh();
			setTimeout(() => {
				show();
			}, 100);
		});
	}

	function onProfileClicked() {
		toProfile(PostMiddleware.getContentTarget(dto)?.postedBy?.userId);
	}

	return (
		<View style={[styles.authorContainerRoot, style]}>
			<View ref={UserDivRef}>
				<TouchableOpacity
					onPress={onAvatarClicked}
					style={styles.authorAvatarContainer}
				>
					{/* @ts-ignore */}
					<Image
						style={{
							flex: 1,
							padding: 2,
							borderRadius: TIMELINE_PFP_SIZE / 2,
						}}
						source={{ uri: STATUS_DTO.postedBy.avatarUrl }}
					/>
				</TouchableOpacity>
			</View>

			<OriginalPosterPostedByFragment
				onClick={onProfileClicked}
				displayNameParsed={STATUS_DTO.postedBy.parsedDisplayName}
				handle={STATUS_DTO.postedBy.handle}
				postedAt={new Date(STATUS_DTO.createdAt)}
				visibility={STATUS_DTO.visibility}
				emojiMap={STATUS_DTO.calculated.emojis}
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
		overflowX: 'hidden',
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
