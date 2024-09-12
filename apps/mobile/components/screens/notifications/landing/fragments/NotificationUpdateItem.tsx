import { memo } from 'react';
import { NotificationSenderMiniInterface } from './NotificationSenderMini';
import {
	DhaagaJsNotificationType,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { View } from 'react-native';
import { styles } from '../segments/_common';

type NotificationUpdateItemProps = {
	acct: UserInterface;
	type: DhaagaJsNotificationType;
	createdAt: Date;
};
const NotificationUpdateItem = memo(
	({ acct, type, createdAt }: NotificationUpdateItemProps) => {
		return (
			<View style={styles.container}>
				<NotificationSenderMiniInterface
					acct={acct}
					type={type}
					createdAt={createdAt}
				/>
				;
			</View>
		);
	},
);

export default NotificationUpdateItem;
