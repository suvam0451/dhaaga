import { Fragment, memo, useState } from 'react';
import {
	TouchableOpacity,
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppTimelinePosts } from '../../../hooks/app/timelines/useAppTimelinePosts';
import { ActivityPubStatusAppDtoType } from '../../../services/approto/activitypub-status-dto.service';

type PostStatLikesProps = {
	onPress: () => void;
	isLiked: boolean;
	likeCount: number;
};

/**
 * Show and allow likes
 */
const PostStatLikes = memo(
	({ onPress, isLiked, likeCount }: PostStatLikesProps) => {
		if (!isLiked && likeCount === 0) return <View />;
		return (
			<TouchableOpacity
				onPress={onPress}
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Text
					style={{
						color: isLiked ? APP_THEME.LINK : '#888',
						fontSize: 13,
						marginLeft: 4,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					{likeCount} Likes
				</Text>
			</TouchableOpacity>
		);
	},
);
/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
const PostStats = memo(function Foo({
	dto,
	style,
}: {
	dto: ActivityPubStatusAppDtoType;
	style?: StyleProp<ViewStyle>;
}) {
	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	const [IsLikeLoading, setIsLikeLoading] = useState(false);

	const { toggleLike } = useAppTimelinePosts();

	function _toggleLike() {
		toggleLike(STATUS_DTO.id, setIsLikeLoading);
	}

	if (
		STATUS_DTO.stats.replyCount < 1 &&
		STATUS_DTO.stats.likeCount < 1 &&
		STATUS_DTO.stats.boostCount < 1
	)
		return <View></View>;

	return (
		<View style={[styles.container, style]}>
			<View style={{ flexGrow: 1 }} />
			{/* Likes */}
			{STATUS_DTO.stats.likeCount > 0 && (
				<Fragment>
					<Text
						style={{
							color: APP_FONT.MEDIUM_EMPHASIS,
							marginLeft: 4,
							fontSize: 12,
							textAlign: 'right',
						}}
					>
						{STATUS_DTO.stats.likeCount} Likes
					</Text>
					<Text style={styles.bull}>&bull;</Text>
				</Fragment>
			)}
			{/* Shares */}
			{STATUS_DTO.stats.boostCount > 0 && (
				<Fragment>
					<Text style={styles.text}>{STATUS_DTO.stats.boostCount} Shares</Text>
					<Text style={styles.bull}>&bull;</Text>
				</Fragment>
			)}

			{/* Replies */}
			{STATUS_DTO.stats.replyCount > 0 && (
				<Text style={styles.text}>{STATUS_DTO.stats.replyCount} Replies</Text>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		fontSize: 12,
		textAlign: 'right',
	},
	bull: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		marginHorizontal: 2,
		opacity: 0.3,
	},
});
export default PostStats;
