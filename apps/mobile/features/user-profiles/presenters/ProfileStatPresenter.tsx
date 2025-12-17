import useAppNavigator from '#/states/useAppNavigator';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ProfileStatItemView from '../view/ProfileStatItemView';

type Props = {
	acctId: string;
	postCount: number;
	followingCount: number;
	followerCount: number;
	style?: StyleProp<ViewStyle>;
	isPreview?: boolean;
};

function ProfileStatPresenter({
	acctId,
	postCount,
	followingCount,
	followerCount,
	style,
	isPreview,
}: Props) {
	const { toFollows, toFollowers, toUserPosts } = useAppNavigator();

	const data = [
		{
			count: postCount,
			label: 'Posts',
			onPress: () => {
				if (!isPreview) toUserPosts(acctId);
			},
		},
		{
			count: followingCount,
			label: 'Following',
			onPress: () => {
				if (!isPreview) toFollows(acctId);
			},
		},
		{
			count: followerCount,
			label: 'Followers',
			onPress: () => {
				if (!isPreview) toFollowers(acctId);
			},
		},
	];

	return (
		<View style={[styles.root, style]}>
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
	root: {
		flexGrow: 1,
		marginHorizontal: 10,
		flexDirection: 'row',
	},
});
