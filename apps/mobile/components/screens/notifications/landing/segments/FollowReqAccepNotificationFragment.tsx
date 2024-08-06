import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const FollowReqAcceptNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED}
			/>
		</View>
	);
});

export default FollowReqAcceptNotificationFragment;
