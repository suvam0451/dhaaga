import { Fragment, memo, useState } from 'react';
import {
	TouchableOpacity,
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../styles/AppFonts';
import { ActivityPubStatusAppDtoType } from '../../../services/ap-proto/activitypub-status-dto.service';
import { useAppTimelineDataContext } from '../timeline/api/useTimelineData';

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
				<AntDesign
					name="like2"
					size={16}
					color={isLiked ? APP_THEME.LINK : '#ffffff87'}
				/>
				<Text
					style={{
						color: isLiked ? APP_THEME.LINK : '#888',
						fontSize: 13,
						marginLeft: 4,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					{likeCount}
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

	const { toggleLike } = useAppTimelineDataContext();

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
			<PostStatLikes
				isLiked={STATUS_DTO.interaction.liked}
				likeCount={STATUS_DTO.stats.likeCount}
				onPress={_toggleLike}
			/>
			<View style={{ flexGrow: 1 }}></View>
			{STATUS_DTO.stats.replyCount > 0 && (
				<Fragment>
					<Text
						style={{
							color: '#888',
							marginLeft: 4,
							fontSize: 12,
							textAlign: 'right',
						}}
					>
						{STATUS_DTO.stats.replyCount} Replies
					</Text>
					<Text style={{ color: '#888', marginLeft: 2, opacity: 0.3 }}>
						&bull;
					</Text>
				</Fragment>
			)}
			{STATUS_DTO.stats.boostCount > 0 && (
				<Fragment>
					<Text
						style={{
							color: '#888',
							fontSize: 12,
							marginLeft: 2,
							textAlign: 'right',
						}}
					>
						{STATUS_DTO.stats.boostCount} Boosts
					</Text>
				</Fragment>
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
});
export default PostStats;
