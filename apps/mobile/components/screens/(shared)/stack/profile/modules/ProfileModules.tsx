import { useMemo, useState } from 'react';
import ProfileGalleryModePresenter from '../../../../../../features/user-profiles/features/gallery-mode/presenters/ProfileGalleryModePresenter';
import { StyleProp, View, ViewStyle, Dimensions, FlatList } from 'react-native';
import { AppUserObject } from '../../../../../../types/app-user.types';
import { AppInstagramTabControl } from '../../../../../lib/SegmentedControl';
import useApiGetPinnedPosts from '../../../../../../hooks/api/accounts/useApiGetPinnedPosts';
import { useAppTheme } from '../../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../lib/Text';
import StatusItem from '../../../../../common/status/StatusItem';
import WithAppStatusItemContext from '../../../../../../hooks/ap-proto/useAppStatusItem';
import SocialUpdatePresenter from '../../../../../../features/inbox/presenters/SocialUpdatePresenter';
import UpdatesPresenter from '../../../../../../features/inbox/presenters/UpdatesPresenter';

type AppPagerViewListProps = {
	userId: string;
	previewedAcct: AppUserObject;
};

function ProfilePinnedPosts({ userId }: AppPagerViewListProps) {
	const { height } = Dimensions.get('window');
	const { data, error } = useApiGetPinnedPosts(userId);

	if (error) {
		console.log('[ERROR]: profile pinned posts', error);
		return <View />;
	}

	if (data.length === 0)
		return (
			<View>
				<AppText.Medium style={{ fontSize: 18 }}>
					This user does not have any pinned posts
				</AppText.Medium>
			</View>
		);

	return (
		<View style={{ minHeight: height, marginTop: 8 }}>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem isPin />
					</WithAppStatusItemContext>
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
function ProfileModules({ profileId, acct }: ProfileModulesProps) {
	const { theme } = useAppTheme();
	const { height } = Dimensions.get('window');
	const [TabIndex, setTabIndex] = useState(0);

	const Content = useMemo(() => {
		switch (TabIndex) {
			case 0:
				return <ProfileGalleryModePresenter userId={profileId} />;
			case 1:
				return <ProfilePinnedPosts previewedAcct={acct} userId={profileId} />;
			case 2:
				return <SocialUpdatePresenter />;
			case 3:
				return <UpdatesPresenter />;
			default:
				return null;
		}
	}, [TabIndex, profileId]);

	return (
		<View style={{ paddingBottom: 12, minHeight: height - 36 }}>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 36,
					marginHorizontal: 10,
				}}
			>
				<AppInstagramTabControl
					tabIcons={[
						'gallery',
						'pin-octicons',
						'newspaper',
						'chat-ellipses-outline',
					]}
					index={TabIndex}
					onIndexChange={setTabIndex}
					style={{
						backgroundColor: theme.background.a20,
						paddingTop: 8,
						marginBottom: 16,
						borderRadius: 8,
					}}
				/>
			</View>
			<View style={{ minHeight: height / 2 }}>{Content}</View>
		</View>
	);
}

export default ProfileModules;
