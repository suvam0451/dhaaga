import { Fragment, memo, useEffect, useState } from 'react';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import * as Haptics from 'expo-haptics';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	isRepost: boolean;
};

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
		if (likeCount === 0) return <View />;
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
				{/*<FontAwesome*/}
				{/*	name="star"*/}
				{/*	size={18}*/}
				{/*	color={isLiked ? APP_THEME.LINK : '#ffffff87'}*/}
				{/*/>*/}
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
const PostStats = memo(function Foo({ isRepost }: Props) {
	const {
		status: post,
		setDataRaw,
		sharedStatus,
	} = useActivitypubStatusContext();
	const { client } = useActivityPubRestClientContext();
	const [RepliesCount, setRepliesCount] = useState(0);
	const [FavouritesCount, setFavouritesCount] = useState(0);
	const [RepostCount, setRepostCount] = useState(0);
	const [IsFavourited, setIsFavourited] = useState(false);
	const [SeparatorDotCount, setSeparatorDotCount] = useState(0);
	const _status = isRepost ? sharedStatus : post;

	useEffect(() => {
		if (!_status) return;
		setRepliesCount(_status?.getRepliesCount());
		setFavouritesCount(_status?.getFavouritesCount());
		setRepostCount(_status?.getRepostsCount());
		setIsFavourited(_status?.getIsFavourited());

		let count = 0;
		if (_status?.getIsFavourited()) count++;
		if (_status?.getRepliesCount() > 0) count++;
		if (_status?.getFavouritesCount() > 0) count++;
		if (_status?.getRepostsCount()) count++;

		setSeparatorDotCount(count);
	}, [_status]);

	function onFavouriteClick() {
		if (IsFavourited) {
			client.unFavourite(_status?.getId()).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		} else {
			client.favourite(_status?.getId()).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		}
	}

	if (RepliesCount < 1 && FavouritesCount < 1 && RepostCount < 1)
		return <View></View>;

	return (
		<View style={styles.container}>
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
