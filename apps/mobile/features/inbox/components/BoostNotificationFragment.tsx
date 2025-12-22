import { UngroupedNotificationWithPostProps, styles } from './_common';
import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { NotificationPostPeek } from '#/features/inbox/components/NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import { useAppTheme } from '#/states/global/hooks';

function BoostNotificationFragment({
	user,
	post,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REBLOG}
				createdAt={createdAt}
			/>
			<NotificationPostPeek post={post?.boostedFrom || post} />
		</View>
	);
}

export default BoostNotificationFragment;
