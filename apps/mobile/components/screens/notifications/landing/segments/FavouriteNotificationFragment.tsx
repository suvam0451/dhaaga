import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';

const FavouriteNotificationFragment = memo(function Foo({ item }: Props) {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.FAVOURITE}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.FAVOURITE}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default FavouriteNotificationFragment;
