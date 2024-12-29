import { memo } from 'react';
import { Props, styles } from './_common';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';

const BoostNotificationFragment = memo(function Foo({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.REBLOG}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={post} />
		</View>
	);
});

export default BoostNotificationFragment;
