import { memo, useMemo, useState } from 'react';
import ProfileImageGallery from './ProfileImageGallery';
import {
	StyleProp,
	View,
	ViewStyle,
	Dimensions,
	Text,
	FlatList,
} from 'react-native';
import { AppUserObject } from '../../../../../../types/app-user.types';
import { AppInstagramTabControl } from '../../../../../lib/SegmentedControl';
import SocialView from '../../../../notifications/landing/views/SocialView';
import UpdatesView from '../../../../notifications/landing/views/UpdatesView';
import usePinnedPosts from '../../../../../common/user/api/usePinnedPosts';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { NotificationPostPeek } from '../../../../notifications/landing/fragments/NotificationPostPeek';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationSenderInterface } from '../../../../notifications/landing/fragments/NotificationSender';

type AppPagerViewListProps = {
	userId: string;
	previewedAcct: AppUserObject;
};

function ProfilePinnedPosts({ userId, previewedAcct }: AppPagerViewListProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { height } = Dimensions.get('window');
	const { data } = usePinnedPosts(userId);
	if (data.length === 0)
		return (
			<View>
				<Text style={{ color: theme.secondary.a10, fontSize: 18 }}>
					This user does not have any pinned posts
				</Text>
				<Text>This user does not have any pinned posts</Text>
			</View>
		);

	return (
		<View style={{ height: height, marginTop: 8, paddingHorizontal: 10 }}>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<View>
						<NotificationSenderInterface
							acct={previewedAcct}
							type={DhaagaJsNotificationType.STATUS}
							createdAt={item.createdAt}
						/>
						<NotificationPostPeek acct={previewedAcct} post={item} />
					</View>
				)}
			/>
		</View>
	);
}

type ProfileModulesProps = {
	acct: AppUserObject;
	profileId: string;
	fields: any[];
	style?: StyleProp<ViewStyle>;
};

/**
 * Various modules available
 * in profile page that can be
 * expanded
 */
const ProfileModules = memo(({ profileId, acct }: ProfileModulesProps) => {
	const { height } = Dimensions.get('window');
	const [TabIndex, setTabIndex] = useState(0);

	const Content = useMemo(() => {
		switch (TabIndex) {
			case 0:
				return <ProfileImageGallery userId={profileId} />;
			case 1:
				return <ProfilePinnedPosts previewedAcct={acct} userId={profileId} />;
			case 2:
				return <SocialView />;
			case 3:
				return <UpdatesView />;
			default:
				return null;
		}
	}, [TabIndex, profileId]);

	return (
		<View style={{ paddingBottom: 12 }}>
			<View style={{ flexDirection: 'row', marginTop: 36 }}>
				<AppInstagramTabControl
					tabIcons={[
						'gallery',
						'pin-octicons',
						'newspaper',
						'chat-ellipses-outline',
					]}
					index={TabIndex}
					onIndexChange={setTabIndex}
				/>
			</View>
			<View style={{ minHeight: height / 2 }}>{Content}</View>
		</View>
	);
});

export default ProfileModules;
