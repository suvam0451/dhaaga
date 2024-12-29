import { memo } from 'react';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';

const MentionNotificationFragment = memo(({ item }: Props) => {
	const user = item.user;
	const post = item.post;

	console.log(post.calculated.emojis);
	return (
		<View style={[styles.container]}>
			<NotificationSenderInterface
				user={user}
				type={DhaagaJsNotificationType.MENTION}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
});

export default MentionNotificationFragment;
