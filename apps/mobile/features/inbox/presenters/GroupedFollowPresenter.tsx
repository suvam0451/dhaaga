import { View } from 'react-native';
import {
	GroupedNotificationWithUserProps,
	styles,
} from '../components/_common';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { NativeTextNormal } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import { DatetimeUtil } from '#/utils/datetime.utils';

function GroupedFollowPresenter({
	users,
	createdAt,
}: GroupedNotificationWithUserProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: appDimensions.timelines.sectionBottomMargin * 1.25,
				}}
			>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<AppIcon id="add" size={18} color={theme.complementary} />
					<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
						{users.length} users followed you
					</NativeTextNormal>
				</View>
				<NativeTextNormal
					style={[
						styles.timeAgo,
						{
							color: theme.secondary.a40,
						},
					]}
				>
					{DatetimeUtil.timeAgo(createdAt)}
				</NativeTextNormal>
			</View>
			<GroupedUsersItemView items={users} />
		</View>
	);
}

export default GroupedFollowPresenter;
