import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';

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
			<NotificationPostPeek acct={user} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
});

export default FavouriteNotificationFragment;
