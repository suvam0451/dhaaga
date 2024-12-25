import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const FollowReqAcceptNotificationFragment = memo(({ item }: Props) => {
	const user = item.user;
	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED}
				createdAt={item.createdAt}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED}
				createdAt={item.createdAt}
				id={item.id}
			/>
		</View>
	);
});

export default FollowReqAcceptNotificationFragment;
