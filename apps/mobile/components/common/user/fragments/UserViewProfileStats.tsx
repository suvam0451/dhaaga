import { memo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import useAppNavigator from '../../../../states/useAppNavigator';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../../styles/AppFonts';

type ProfileStatsProps = {
	userId: string;
	postCount?: number;
	followingCount?: number;
	followerCount?: number;
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
const UserViewProfileStats = memo(
	({ postCount, followingCount, followerCount, userId }: ProfileStatsProps) => {
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
			<View style={[styles.container, {}]}>
				<TouchableOpacity style={styles.touchContainer} onPress={onPostsPress}>
					<Text style={[styles.primaryText, { color: theme.complementary.a0 }]}>
						{util(postCount)}
					</Text>
					<Text style={[styles.secondaryText, { color: theme.secondary.a20 }]}>
						Posts
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.touchContainer}
					onPress={onFollowsPress}
				>
					<Text style={[styles.primaryText, { color: theme.complementary.a0 }]}>
						{util(followingCount)}
					</Text>
					<Text
						style={[styles.secondaryText, { color: theme.textColor.medium }]}
					>
						Follows
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.touchContainer}
					onPress={onFollowersPress}
				>
					<Text style={[styles.primaryText, { color: theme.complementary.a0 }]}>
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

export default UserViewProfileStats;

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		flexDirection: 'row',
		borderRadius: 10,
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
