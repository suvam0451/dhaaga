import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { Props, styles } from '../segments/_common';
import { AppDivider } from '../../../../lib/Divider';
import { NotificationSenderInterface } from './NotificationSender';

function NotificationUpdateItem({ item }: Props) {
	const user = item.user;
	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.FOLLOW}
				createdAt={item.createdAt}
			/>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default NotificationUpdateItem;
