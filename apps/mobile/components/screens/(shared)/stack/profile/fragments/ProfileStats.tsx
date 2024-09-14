import { memo } from 'react';
import {
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import styles from '../../../../../common/user/utils/styles';
import { useActivitypubUserContext } from '../../../../../../states/useProfile';
import useAppNavigator from '../../../../../../states/useAppNavigator';

type ProfileStatsProps = {
	userId: string;
	postCount?: number;
	followingCount?: number;
	followerCount?: number;
	style?: StyleProp<ViewStyle>;
};

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

/**
 * Shows the post and follower
 * count stats for a profile
 */
const ProfileStats = memo(
	({
		postCount,
		followingCount,
		followerCount,
		style,
		userId,
	}: ProfileStatsProps) => {
		const { toFollows, toFollowers } = useAppNavigator();

		function onFollowsPress() {
			toFollows(userId);
		}

		function onPostsPress() {}

		function onFollowersPress() {
			toFollowers(userId);
		}
		return (
			<View style={[{ flexDirection: 'row', flex: 1 }, style]}>
				<TouchableOpacity
					style={{
						alignItems: 'center',
						paddingHorizontal: 6,
					}}
					onPress={onPostsPress}
				>
					<Text style={styles.primaryText}>{util(postCount)}</Text>
					<Text style={styles.secondaryText}>Posts</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ alignItems: 'center', flex: 1 }}
					onPress={onFollowsPress}
				>
					<Text style={styles.primaryText}>{util(followingCount)}</Text>
					<Text style={styles.secondaryText}>Follows</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						alignItems: 'center',
						paddingHorizontal: 6,
					}}
					onPress={onFollowersPress}
				>
					<Text style={styles.primaryText}>{util(followerCount)}</Text>
					<Text style={styles.secondaryText}>Followers</Text>
				</TouchableOpacity>
			</View>
		);
	},
);

type ProfileStatsInterfaceProps = {
	style?: StyleProp<ViewStyle>;
};
export const ProfileStatsInterface = memo(
	({ style }: ProfileStatsInterfaceProps) => {
		const { user } = useActivitypubUserContext();
		return (
			<ProfileStats
				followerCount={user?.getFollowersCount()}
				followingCount={user?.getFollowingCount()}
				postCount={user?.getPostCount()}
				style={style}
				userId={user?.getId()}
			/>
		);
	},
);

export default ProfileStats;
