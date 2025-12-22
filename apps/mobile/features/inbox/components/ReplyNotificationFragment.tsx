import { UngroupedNotificationWithPostProps, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from './NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import { useAppTheme } from '#/states/global/hooks';

function ReplyNotificationFragment({
	user,
	post,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REPLY}
				createdAt={createdAt}
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default ReplyNotificationFragment;
