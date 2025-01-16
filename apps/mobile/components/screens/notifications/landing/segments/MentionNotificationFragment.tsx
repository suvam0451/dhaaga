import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';

function MentionNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={[styles.container]}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.MENTION}
				createdAt={item.post?.createdAt || item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default MentionNotificationFragment;
