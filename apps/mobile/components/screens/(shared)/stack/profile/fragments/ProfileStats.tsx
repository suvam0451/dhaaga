import { memo } from 'react';
import {
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import styles from '../../../../../common/user/utils/styles';
import useAppNavigator from '../../../../../../states/useAppNavigator';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		const { toFollows, toFollowers } = useAppNavigator();

		function onFollowsPress() {
			toFollows(userId);
		}

		function onPostsPress() {}

		function onFollowersPress() {
			toFollowers(userId);
		}

		return (
			<View
				style={[
					{ flexDirection: 'row', flex: 1 },
					style,
					{ backgroundColor: theme.palette.menubar },
				]}
			>
				<TouchableOpacity
					style={{
						alignItems: 'center',
						paddingHorizontal: 6,
					}}
					onPress={onPostsPress}
				>
					<Text style={[styles.primaryText, { color: theme.textColor.high }]}>
						{util(postCount)}
					</Text>
					<Text
						style={[styles.secondaryText, { color: theme.textColor.medium }]}
					>
						Posts
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ alignItems: 'center', flex: 1 }}
					onPress={onFollowsPress}
				>
					<Text style={[styles.primaryText, { color: theme.textColor.high }]}>
						{util(followingCount)}
					</Text>
					<Text
						style={[styles.secondaryText, { color: theme.textColor.medium }]}
					>
						Follows
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						alignItems: 'center',
						paddingHorizontal: 6,
					}}
					onPress={onFollowersPress}
				>
					<Text style={[styles.primaryText, { color: theme.textColor.high }]}>
						{util(followerCount)}
					</Text>
					<Text
						style={[styles.secondaryText, { color: theme.textColor.medium }]}
					>
						Followers
					</Text>
				</TouchableOpacity>
			</View>
		);
	},
);

export default ProfileStats;
