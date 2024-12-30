import { memo } from 'react';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const FollowNotificationFragment = memo(function Foo({ item }: Props) {
	const user = item.user;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.FOLLOW}
				createdAt={item.createdAt}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.FOLLOW}
				createdAt={item.createdAt}
				id={item.id}
			/>
		</View>
	);
});

export default FollowNotificationFragment;
