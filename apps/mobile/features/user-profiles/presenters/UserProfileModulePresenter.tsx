import { useMemo, useRef, useState } from 'react';
import ProfileGalleryModePresenter from '../features/gallery-mode/presenters/ProfileGalleryModePresenter';
import { StyleProp, View, ViewStyle, Dimensions, FlatList } from 'react-native';
import { AppUserObject } from '../../../types/app-user.types';
import { AppInstagramTabControl } from '../../../components/lib/SegmentedControl';
import useApiGetPinnedPosts from '../../../hooks/api/accounts/useApiGetPinnedPosts';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';
import StatusItem from '../../../components/common/status/StatusItem';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import SocialUpdatePresenter from '../../inbox/presenters/SocialUpdatePresenter';
import { appDimensions } from '../../../styles/dimensions';
import UpdatesPresenter from '../../inbox/presenters/UpdatesPresenter';

type AppPagerViewListProps = {
	userId: string;
	previewedAcct: AppUserObject;
};

function ProfilePinnedPosts({ userId }: AppPagerViewListProps) {
	const { data, error, isFetched } = useApiGetPinnedPosts(userId);
	const ref = useRef<FlatList>(null);

	if (error) {
		console.log('[ERROR]: profile pinned posts', error);
		return <View />;
	}

	if (!isFetched) return <View />;
	if (isFetched && data.length === 0)
		return (
			<View>
				<AppText.Medium style={{ fontSize: 18 }}>
					This user does not have any pinned posts
				</AppText.Medium>
			</View>
		);

	return (
		<View style={{ marginTop: 8 }}>
			<FlatList
				ref={ref}
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
function UserProfileModulePresenter({ profileId, acct }: ProfileModulesProps) {
	const { theme } = useAppTheme();
	const [TabIndex, setTabIndex] = useState(0);

	const Content = useMemo(() => {
		switch (TabIndex) {
			case 0:
				return (
					<View
						style={{
							// 54 for bottom menu, 64 for profile module menu
							height: Dimensions.get('window').height - 54 - 64,
						}}
					>
						<ProfileGalleryModePresenter userId={profileId} />;
					</View>
				);

			case 1:
				return (
					<View
						style={{
							// 54 for bottom menu, 64 for profile module menu
							minHeight: Dimensions.get('window').height - 54 - 64,
							paddingBottom: 32,
						}}
					>
						<ProfilePinnedPosts previewedAcct={acct} userId={profileId} />
					</View>
				);
			case 2:
				return <SocialUpdatePresenter />;
			case 3:
				return <UpdatesPresenter />;
			default:
				return null;
		}
	}, [TabIndex, profileId]);

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 12,
					marginHorizontal: 10,
				}}
			>
				<AppInstagramTabControl
					tabIcons={[
						'gallery',
						'pin-octicons',
						// 'newspaper',
						// 'chat-ellipses-outline',
					]}
					index={TabIndex}
					onIndexChange={setTabIndex}
					style={{
						backgroundColor: theme.background.a20,
						paddingTop: 8,
						marginBottom: appDimensions.timelines.sectionBottomMargin,
						borderRadius: 8,
					}}
				/>
			</View>
			{Content}
		</View>
	);
}

export default UserProfileModulePresenter;
