import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';

const StatusAlertNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.STATUS}
				extraData={item?.extraData}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.STATUS}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default StatusAlertNotificationFragment;
