import { memo } from 'react';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const FollowNotificationFragment = memo(function Foo({ item }: Props) {
	const acct = item.acct;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.FOLLOW}
			/>
			<NotificationDescriptionText type={DhaagaJsNotificationType.FOLLOW} />
		</View>
	);
});

export default FollowNotificationFragment;
