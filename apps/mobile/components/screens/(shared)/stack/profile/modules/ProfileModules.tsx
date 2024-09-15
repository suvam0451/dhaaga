import { memo } from 'react';
import ProfileExtraInfo from './ProfileExtraInfo';
import ProfilePinnedPosts from './ProfilePinnedPosts';
import ProfileImageGallery from './ProfileImageGallery';
import { StyleProp, View, ViewStyle } from 'react-native';
import ProfileBlueskyFeeds from './ProfileBlueskyFeeds';
import ProfileBlueskyLists from './ProfileBlueskyLists';

type ProfileModulesProps = {
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
	({ profileId, fields, style }: ProfileModulesProps) => {
		return (
			<View style={style}>
				<ProfileExtraInfo fields={fields} />
				<ProfileImageGallery userId={profileId} />
				<ProfilePinnedPosts userId={profileId} />
				<ProfileBlueskyFeeds userId={profileId} />
				<ProfileBlueskyLists userId={profileId} />
			</View>
		);
	},
);

export default ProfileModules;
