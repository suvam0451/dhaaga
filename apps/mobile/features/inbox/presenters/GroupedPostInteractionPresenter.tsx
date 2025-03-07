import { View } from 'react-native';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import { Props } from '../components/_common';
import { AppText } from '../../../components/lib/Text';
import { AppDivider } from '../../../components/lib/Divider';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { appDimensions } from '../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { MoreOptionsButtonSectionView } from '../components/MoreOptionsButtonSectionView';

function GroupedPostInteractionPresenter({ item }: Props) {
	return (
		<View>
			<View style={{ paddingHorizontal: 10 }}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: appDimensions.timelines.sectionBottomMargin * 1.25,
					}}
				>
					<View style={{ flex: 1 }}>
						<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
							{item.users.length} users liked/shared your post
						</AppText.Medium>
					</View>
					<MoreOptionsButtonSectionView createdAt={item.createdAt} />
				</View>
				<View
					style={{
						marginBottom: appDimensions.timelines.sectionBottomMargin * 1.5,
					}}
				>
					<GroupedUsersItemView items={item.users} />
				</View>
				<NotificationPostPeek post={item.post?.boostedFrom || item.post} />
			</View>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default GroupedPostInteractionPresenter;
