import { memo } from 'react';
import ProfileExtraInfo from './ProfileExtraInfo';
import ProfilePinnedPosts from './ProfilePinnedPosts';
import ProfileImageGallery from './ProfileImageGallery';
import { StyleProp, View, ViewStyle } from 'react-native';
import ProfileBlueskyFeeds from './ProfileBlueskyFeeds';
import ProfileBlueskyLists from './ProfileBlueskyLists';
import { AppUser } from '../../../../../../types/app-user.types';

type ProfileModulesProps = {
	acct: AppUser;
	profileId: string;
	fields: any[];
	style?: StyleProp<ViewStyle>;
};

/**
 * Various modules available
 * in profile page that can be
 * expanded
 */
const ProfileModules = memo(
	({ profileId, style, acct }: ProfileModulesProps) => {
		return (
			<View style={style}>
				<ProfileExtraInfo acct={acct} />
				<ProfileImageGallery userId={profileId} />
				<ProfilePinnedPosts userId={profileId} />
				<ProfileBlueskyFeeds userId={profileId} />
				<ProfileBlueskyLists userId={profileId} />
			</View>
		);
	},
);

export default ProfileModules;
