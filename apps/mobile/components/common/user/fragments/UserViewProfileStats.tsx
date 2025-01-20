import { memo } from 'react';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import useAppNavigator from '../../../../states/useAppNavigator';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

type PressableStatCounterProps = {
	count: number;
	label: string;
	onPress?: () => void;
};

function PressableStatCounter({
	count,
	label,
	onPress,
}: PressableStatCounterProps) {
	const { theme } = useAppTheme();
	function _onPress() {
		if (onPress) onPress();
	}
	return (
		<Pressable style={[{}, styles.touchContainer]} onPress={_onPress}>
			<AppText.H6 style={{ color: theme.complementary.a0 }}>
				{util(count)}
			</AppText.H6>
			<AppText.Medium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				style={[{ fontSize: 13 }]}
			>
				{label}
			</AppText.Medium>
		</Pressable>
	);
}

type ProfileStatsProps = {
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
const UserViewProfileStats = memo(
	({
		postCount,
		followingCount,
		followerCount,
		userId,
		style,
	}: ProfileStatsProps) => {
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
				label: 'Follows',
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
					<PressableStatCounter
						key={i}
						label={o.label}
						count={o.count}
						onPress={o.onPress}
					/>
				))}
			</View>
		);
	},
);

export default UserViewProfileStats;

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
