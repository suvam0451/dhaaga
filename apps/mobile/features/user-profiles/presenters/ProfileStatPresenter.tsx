import useAppNavigator from '../../../states/useAppNavigator';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import ProfileStatItemView from '../view/ProfileStatItemView';

type Props = {
	acctId: string;
	postCount: number;
	followingCount: number;
	followerCount: number;
	style?: StyleProp<ViewStyle>;
};

function ProfileStatPresenter({
	acctId,
	postCount,
	followingCount,
	followerCount,
	style,
}: Props) {
	const { toFollows, toFollowers, toUserPosts } = useAppNavigator();

	const data = [
		{
			count: postCount,
			label: 'Posts',
			onPress: () => {
				toUserPosts(acctId);
			},
		},
		{
			count: followingCount,
			label: 'Following',
			onPress: () => {
				toFollows(acctId);
			},
		},
		{
			count: followerCount,
			label: 'Followers',
			onPress: () => {
				toFollowers(acctId);
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

export default ProfileStatPresenter;

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
