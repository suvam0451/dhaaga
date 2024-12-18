import { memo } from 'react';
import ProfileExtraInfo from './ProfileExtraInfo';
import ProfilePinnedPosts from './ProfilePinnedPosts';
import ProfileImageGallery from './ProfileImageGallery';
import { StyleProp, View, ViewStyle, StyleSheet, Text } from 'react-native';
import ProfileBlueskyFeeds from './ProfileBlueskyFeeds';
import ProfileBlueskyLists from './ProfileBlueskyLists';
import { AppUser } from '../../../../../../types/app-user.types';
import PagerView from 'react-native-pager-view';
import {
	AppInstagramTabControl,
	AppSegmentedControl,
} from '../../../../../lib/SegmentedControl';
import { SocialHubAvatarCircle } from '../../../../../lib/Avatar';

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
			<View style={{ paddingBottom: 12 }}>
				<View style={{ flexDirection: 'row', marginTop: 36 }}>
					<AppInstagramTabControl />
					{/*<AppSegmentedControl*/}
					{/*	items={[*/}
					{/*		{ label: 'Gallery' },*/}
					{/*		{ label: 'Pinned' },*/}
					{/*		{ label: 'Posts' },*/}
					{/*		{ label: 'Replies' },*/}
					{/*	]}*/}
					{/*	style={{ marginVertical: 16 }}*/}
					{/*	leftDecorator={*/}
					{/*		<SocialHubAvatarCircle size={36} style={{ marginRight: 6 }} />*/}
					{/*	}*/}
					{/*/>*/}
				</View>
				<View style={{ marginTop: 2 }}>
					<ProfileImageGallery userId={profileId} />
				</View>

				{/*<ProfileExtraInfo acct={acct} />*/}

				{/*<ProfilePinnedPosts userId={profileId} />*/}
				{/*<ProfileBlueskyFeeds userId={profileId} />*/}
				{/*<ProfileBlueskyLists userId={profileId} />*/}
			</View>
		);
	},
);

export default ProfileModules;

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
		height: '100%',
		backgroundColor: 'red',
	},
});
