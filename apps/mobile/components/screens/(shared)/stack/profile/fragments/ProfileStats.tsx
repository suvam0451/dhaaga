import { memo } from 'react';
import {
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import useAppNavigator from '../../../../../../states/useAppNavigator';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

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
					styles.container,
					style,
					{ backgroundColor: theme.palette.menubar },
				]}
			>
				<TouchableOpacity
					style={{
						alignItems: 'center',
						paddingHorizontal: 8,
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
					style={{ alignItems: 'center', flex: 1, paddingHorizontal: 8 }}
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
						paddingHorizontal: 8,
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

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 1,
		minWidth: 196,
		maxWidth: 1024,
		paddingHorizontal: 8,
		marginRight: 8,
		borderRadius: 10,
		paddingVertical: 6,
	},
	primaryText: {
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	secondaryText: { fontSize: 14, fontFamily: APP_FONTS.INTER_500_MEDIUM },
});
