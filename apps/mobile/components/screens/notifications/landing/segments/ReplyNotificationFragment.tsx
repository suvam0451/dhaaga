import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function ReplyNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.REPLY}
				createdAt={item.post?.createdAt as any}
			/>
			<NotificationPostPeek acct={user} post={post} />
		</View>
	);
}

export default ReplyNotificationFragment;
