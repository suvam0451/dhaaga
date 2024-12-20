import { memo } from 'react';
import { Props, styles } from './_common';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';

const BoostNotificationFragment = memo(function Foo({ item }: Props) {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.REBLOG}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default BoostNotificationFragment;
