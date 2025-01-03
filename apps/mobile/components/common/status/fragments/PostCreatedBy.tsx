import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { memo, useMemo, useRef } from 'react';
import { Skeleton } from '@rneui/base';
import useMfm from '../../../hooks/useMfm';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_KNOWN_MODAL } from '../../../../states/_global';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { appDimensions } from '../../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import {
	useAppApiClient,
	useAppManager,
	useAppModalState,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../../lib/Text';

const TIMELINE_PFP_SIZE = appDimensions.timelines.avatarIconSize;

/**
 * Renders the user (poster)'s avatar
 */
export const OriginalPostedPfpFragment = memo(function Foo({
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
});

function OriginalPosterSkeleton() {
	return (
		<View style={{ width: '90%' }}>
			<View
				style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 0 }}
			>
				<Skeleton style={{ height: 52, width: 52, borderRadius: 4 }} />
				<View style={{ flexGrow: 1, marginRight: 16 }}>
					<Skeleton
						style={{
							height: 52,
							marginLeft: 8,
							borderRadius: 4,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

export const OriginalPosterPostedByFragment = memo(function Foo({
	displayNameRaw,
	onClick,
	emojiMap,
	instanceUrl,
	postedAt,
}: {
	displayNameRaw: string;
	onClick: () => void;
	emojiMap?: Map<string, string>;
	instanceUrl: string;
	visibility: string;
	postedAt: Date;
}) {
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	const { content: UsernameWithEmojis } = useMfm({
		content: displayNameRaw,
		emojiMap: emojiMap,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		numberOfLines: 1,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
	});

	return (
		<View
			style={{
				alignItems: 'flex-start',
				marginLeft: 8, // to leave sufficient space to show indicator icons
				marginRight: 84,
			}}
		>
			<View>
				<Pressable onPress={onClick}>
					<View>
						{/* No need to parse for Bluesky */}
						{driver === KNOWN_SOFTWARE.BLUESKY ? (
							<AppText.Medium>{displayNameRaw}</AppText.Medium>
						) : UsernameWithEmojis ? (
							UsernameWithEmojis
						) : (
							<Text> </Text>
						)}
					</View>
					<Text
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
							fontFamily: APP_FONTS.INTER_400_REGULAR,
							maxWidth: 196,
						}}
						numberOfLines={1}
					>
						{instanceUrl} • {DatetimeUtil.timeAgo(postedAt)}
					</Text>
				</Pressable>
			</View>
		</View>
	);
});

type OriginalPosterProps = {
	style?: StyleProp<ViewStyle>;
};

/**
 * This is the author indicator for
 * the bottom-most post item
 */
const PostCreatedBy = memo(({ style }: OriginalPosterProps) => {
	const { appManager } = useAppManager();
	const { show, refresh } = useAppModalState(APP_KNOWN_MODAL.USER_PEEK);
	const { dto } = useAppStatusItem();
	const STATUS_DTO = PostMiddleware.getContentTarget(dto);

	const UserDivRef = useRef(null);

	function onProfileClicked() {
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

	return useMemo(() => {
		if (!STATUS_DTO.postedBy) return <OriginalPosterSkeleton />;
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
						onPress={onProfileClicked}
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
								backgroundColor: '#0553',
								padding: 2,
								borderRadius: TIMELINE_PFP_SIZE / 2,
								overflow: 'hidden',
							}}
							source={{ uri: STATUS_DTO.postedBy.avatarUrl }}
						/>
					</TouchableOpacity>
				</View>

				<OriginalPosterPostedByFragment
					onClick={onProfileClicked}
					displayNameRaw={STATUS_DTO.postedBy.displayName}
					instanceUrl={STATUS_DTO.postedBy.handle}
					postedAt={new Date(STATUS_DTO.createdAt)}
					visibility={STATUS_DTO.visibility}
					emojiMap={STATUS_DTO.calculated.emojis}
				/>
			</View>
		);
	}, [STATUS_DTO.postedBy, style]);
});

export default PostCreatedBy;
