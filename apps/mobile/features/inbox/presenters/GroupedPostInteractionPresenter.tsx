import { View } from 'react-native';
import { NotificationPostPeek } from '../components/NotificationPostPeek';
import { GroupedNotificationWithPostProps } from '../components/_common';
import { AppText } from '#/components/lib/Text';
import { AppDivider } from '#/components/lib/Divider';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { MoreOptionsButtonSectionView } from '../components/MoreOptionsButtonSectionView';

function GroupedPostInteractionPresenter({
	users,
	createdAt,
	post,
}: GroupedNotificationWithPostProps) {
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
							{users.length} users liked/shared your post
						</AppText.Medium>
					</View>
					<MoreOptionsButtonSectionView createdAt={createdAt} />
				</View>
				<View
					style={{
						marginBottom: appDimensions.timelines.sectionBottomMargin * 1.5,
					}}
				>
					<GroupedUsersItemView items={users} />
				</View>
				<NotificationPostPeek post={post?.boostedFrom || post} />
			</View>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default GroupedPostInteractionPresenter;
