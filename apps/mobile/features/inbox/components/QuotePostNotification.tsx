import { UngroupedNotificationWithPostProps, styles } from './_common';
import AuthorItemPresenter from '#/features/inbox/presenters/AuthorItemPresenter';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '#/features/inbox/components/NotificationPostPeek';
import { View } from 'react-native';
import InboxItemBoostedFrom from '#/features/inbox/components/InboxItemBoostedFrom';

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
	return (
		<View style={[styles.container]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REPLY}
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
