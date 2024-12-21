import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';

const StatusAlertNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.STATUS}
				extraData={item?.extraData}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={acct} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
});

export default StatusAlertNotificationFragment;
