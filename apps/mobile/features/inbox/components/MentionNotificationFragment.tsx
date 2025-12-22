import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { UngroupedNotificationWithPostProps, styles } from './_common';
import { NotificationPostPeek } from './NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import { useAppTheme } from '#/states/global/hooks';

function MentionNotificationFragment({
	user,
	post,
	createdAt,
	extraData,
}: UngroupedNotificationWithPostProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.MENTION}
				createdAt={createdAt}
				extraData={extraData}
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default MentionNotificationFragment;
