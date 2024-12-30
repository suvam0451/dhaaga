import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';

const FavouriteNotificationFragment = memo(function Foo({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.FAVOURITE}
				createdAt={item.createdAt}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.FAVOURITE}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={user} post={post} />
		</View>
	);
});

export default FavouriteNotificationFragment;
