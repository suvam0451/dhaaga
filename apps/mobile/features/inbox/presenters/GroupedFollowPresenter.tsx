import { View } from 'react-native';
import { GroupedNotificationWithUserProps } from '../components/_common';
import { AppText } from '#/components/lib/Text';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { AppDivider } from '#/components/lib/Divider';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { MoreOptionsButtonSectionView } from '../components/MoreOptionsButtonSectionView';

function GroupedFollowPresenter({
	users,
	createdAt,
}: GroupedNotificationWithUserProps) {
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
							{users.length} users followed you
						</AppText.Medium>
					</View>
					<MoreOptionsButtonSectionView createdAt={createdAt} />
				</View>
				<GroupedUsersItemView items={users} />
			</View>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default GroupedFollowPresenter;
