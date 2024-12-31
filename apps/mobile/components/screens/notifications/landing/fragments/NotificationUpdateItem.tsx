import { memo } from 'react';
import { NotificationSenderMiniInterface } from './NotificationSenderMini';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { styles } from '../segments/_common';
import { AppUserObject } from '../../../../../types/app-user.types';
import { AppDivider } from '../../../../lib/Divider';

type NotificationUpdateItemProps = {
	acct: AppUserObject;
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
				<AppDivider.Soft style={{ marginVertical: 12 }} />
			</View>
		);
	},
);

export default NotificationUpdateItem;
