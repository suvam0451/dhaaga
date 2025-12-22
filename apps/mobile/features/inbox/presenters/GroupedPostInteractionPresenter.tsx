import { View } from 'react-native';
import { NotificationPostPeek } from '../components/NotificationPostPeek';
import {
	GroupedNotificationWithPostProps,
	styles,
} from '../components/_common';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { NativeTextNormal } from '#/ui/NativeText';
import { useAppTheme } from '#/states/global/hooks';
import { AppIcon } from '#/components/lib/Icon';
import { DatetimeUtil } from '#/utils/datetime.utils';
import { AppDividerSoft } from '#/ui/Divider';

const NOTIFICATION_TYPE_ICON_SIZE = 18;

function GroupedPostInteractionPresenter({
	users,
	createdAt,
	post,
}: GroupedNotificationWithPostProps) {
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
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<AppIcon
						id="heart-outline"
						size={NOTIFICATION_TYPE_ICON_SIZE}
						color={theme.complementary}
						containerStyle={{ marginRight: 4 }}
					/>
					<AppIcon
						id={'sync-outline'}
						color={theme.complementary}
						size={NOTIFICATION_TYPE_ICON_SIZE}
						containerStyle={{ marginRight: 4 }}
					/>
					<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
						{users.length} users liked/shared your post
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
			<AppDividerSoft style={{ marginVertical: 6 }} />
			<NotificationPostPeek post={post?.boostedFrom || post} />
		</View>
	);
}

export default GroupedPostInteractionPresenter;
