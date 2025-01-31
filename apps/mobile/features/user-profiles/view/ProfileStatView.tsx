import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useAppNavigator from '../../../states/useAppNavigator';
import { APP_FONTS } from '../../../styles/AppFonts';
import ProfileStatItemView from './ProfileStatItemView';

type Props = {
	userId: string;
	postCount?: number;
	followingCount?: number;
	followerCount?: number;
	style?: StyleProp<ViewStyle>;
};

/**
 * Shows the post and follower
 * count stats for a profile
 */
function ProfileStatView({
	postCount,
	followingCount,
	followerCount,
	userId,
	style,
}: Props) {
	const { toFollows, toFollowers, toUserPosts } = useAppNavigator();

	const data = [
		{
			count: postCount,
			label: 'Posts',
			onPress: () => {
				toUserPosts(userId);
			},
		},
		{
			count: followingCount,
			label: 'Following',
			onPress: () => {
				toFollows(userId);
			},
		},
		{
			count: followerCount,
			label: 'Followers',
			onPress: () => {
				toFollowers(userId);
			},
		},
	];
	return (
		<View style={[{ flexDirection: 'row' }, styles.container, style]}>
			{data.map((o, i) => (
				<ProfileStatItemView
					key={i}
					label={o.label}
					count={o.count}
					onPress={o.onPress}
				/>
			))}
		</View>
	);
}

export default ProfileStatView;

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		marginHorizontal: 10,
	},
	primaryText: {
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	secondaryText: { fontSize: 13, fontFamily: APP_FONTS.INTER_400_REGULAR },
	touchContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
	},
});
