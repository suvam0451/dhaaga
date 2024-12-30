import { memo } from 'react';
import { Props, styles } from './_common';
import { View } from 'react-native';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const ReplyNotificationFragment = memo(({ item }: Props) => {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.REPLY}
				createdAt={item.post?.createdAt}
			/>
			<NotificationDescriptionText
				type={DhaagaJsNotificationType.REPLY}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={user} post={post} />
		</View>
	);
});

export default ReplyNotificationFragment;
