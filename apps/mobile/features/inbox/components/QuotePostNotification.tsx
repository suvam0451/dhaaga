import { UngroupedNotificationWithPostProps, styles } from './_common';
import AuthorItemPresenter from '#/features/inbox/presenters/AuthorItemPresenter';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '#/features/inbox/components/NotificationPostPeek';
import { View } from 'react-native';
import InboxItemBoostedFrom from '#/features/inbox/components/InboxItemBoostedFrom';
import { useAppTheme } from '#/states/global/hooks';

/**
 * If a mention is also a quote, we don't have to worry
 * about trying to see if the notification object itself
 * is a boost type
 * @param item
 * @constructor
 */
function QuotePostNotification({
	user,
	post,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.QUOTE}
				createdAt={createdAt}
			/>
			<NotificationPostPeek post={post} />
			{post.meta.isBoost ? (
				<InboxItemBoostedFrom post={post.boostedFrom} />
			) : (
				<View />
			)}
		</View>
	);
}

export default QuotePostNotification;
