import { memo } from 'react';
import { Props, styles } from './_common';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const BoostNotificationFragment = memo(function Foo({ item }: Props) {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.REBLOG}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.REBLOG}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default BoostNotificationFragment;
