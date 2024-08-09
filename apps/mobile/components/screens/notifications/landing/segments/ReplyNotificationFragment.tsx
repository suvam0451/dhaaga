import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const ReplyNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.REPLY}
			/>
			<NotificationDescriptionText type={DhaagaJsNotificationType.REPLY} />
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default ReplyNotificationFragment;
