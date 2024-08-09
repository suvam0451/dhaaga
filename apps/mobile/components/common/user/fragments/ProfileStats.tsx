import { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import styles from '../utils/styles';
import { useActivitypubUserContext } from '../../../../states/useProfile';

type ProfileStatsProps = {
	postCount?: number;
	followingCount?: number;
	followerCount?: number;
	style?: StyleProp<ViewStyle>;
};

const ProfileStats = memo(
	({ postCount, followingCount, followerCount, style }: ProfileStatsProps) => {
		return (
			<View style={[{ display: 'flex', flexDirection: 'row' }, style]}>
				<View style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
					<Text style={styles.primaryText}>{postCount}</Text>
					<Text style={styles.secondaryText}>Posts</Text>
				</View>
				<View style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
					<Text style={styles.primaryText}>{followingCount}</Text>
					<Text style={styles.secondaryText}>Following</Text>
				</View>
				<View style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
					<Text style={styles.primaryText}>{followerCount}</Text>
					<Text style={styles.secondaryText}>Followers</Text>
				</View>
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
			/>
		);
	},
);

export default ProfileStats;
