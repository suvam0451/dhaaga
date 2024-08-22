import { Fragment, memo, useEffect, useState } from 'react';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import {
	TouchableOpacity,
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import * as Haptics from 'expo-haptics';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../styles/AppFonts';
import { ActivityPubStatusAppDtoType } from '../../../services/ap-proto/activitypub-status-dto.service';

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
	const { setDataRaw } = useActivitypubStatusContext();
	const { client } = useActivityPubRestClientContext();
	const [RepliesCount, setRepliesCount] = useState(0);
	const [FavouritesCount, setFavouritesCount] = useState(0);
	const [RepostCount, setRepostCount] = useState(0);
	const [IsFavourited, setIsFavourited] = useState(false);
	const [SeparatorDotCount, setSeparatorDotCount] = useState(0);
	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	useEffect(() => {
		setRepliesCount(STATUS_DTO.stats.replyCount);
		setFavouritesCount(STATUS_DTO.stats.likeCount);
		setRepostCount(STATUS_DTO.stats.boostCount);
		setIsFavourited(STATUS_DTO.interaction.liked);

		let count = 0;
		if (STATUS_DTO.interaction.liked) count++;
		if (STATUS_DTO.stats.replyCount > 0) count++;
		if (STATUS_DTO.stats.likeCount > 0) count++;
		if (STATUS_DTO.stats.boostCount > 0) count++;

		setSeparatorDotCount(count);
	}, [dto]);

	function onFavouriteClick() {
		if (IsFavourited) {
			client.unFavourite(STATUS_DTO.id).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		} else {
			client.favourite(STATUS_DTO.id).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		}
	}

	if (RepliesCount < 1 && FavouritesCount < 1 && RepostCount < 1)
		return <View></View>;

	return (
		<View style={[styles.container, style]}>
			<PostStatLikes
				isLiked={IsFavourited}
				likeCount={FavouritesCount}
				onPress={onFavouriteClick}
			/>
			<View style={{ flexGrow: 1 }}></View>
			{RepliesCount > 0 && (
				<Fragment>
					<Text
						style={{
							color: '#888',
							marginLeft: 4,
							fontSize: 12,
							textAlign: 'right',
						}}
					>
						{RepliesCount} Replies
					</Text>
					<Text style={{ color: '#888', marginLeft: 2, opacity: 0.3 }}>
						&bull;
					</Text>
				</Fragment>
			)}
			{RepostCount > 0 && (
				<Fragment>
					<Text
						style={{
							color: '#888',
							fontSize: 12,
							marginLeft: 2,
							textAlign: 'right',
						}}
					>
						{RepostCount} Boosts
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
