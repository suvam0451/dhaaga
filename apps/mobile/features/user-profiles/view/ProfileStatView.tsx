import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useAppNavigator from '../../../states/useAppNavigator';
import ProfileStatItemView from './ProfileStatItemView';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

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
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	const data = [
		{
			count: postCount,
			label: t(`noun.post`, { count: postCount }),
			onPress: () => {
				toUserPosts(userId);
			},
		},
		{
			count: followingCount,
			label: t(`noun.following`, { count: followingCount }),
			onPress: () => {
				toFollows(userId);
			},
		},
		{
			count: followerCount,
			label: t(`noun.follower`, { count: followerCount }),
			onPress: () => {
				toFollowers(userId);
			},
		},
	];

	return (
		<View style={[styles.container, style]}>
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
		flexDirection: 'row',
		flexGrow: 1,
		marginHorizontal: 10,
	},
});
