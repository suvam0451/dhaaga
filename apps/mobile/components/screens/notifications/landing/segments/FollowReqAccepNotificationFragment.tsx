import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { AppDivider } from '../../../../lib/Divider';

function FollowReqAcceptNotificationFragment({ item }: Props) {
	const user = item.user;
	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED}
				createdAt={item.createdAt}
			/>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default FollowReqAcceptNotificationFragment;
