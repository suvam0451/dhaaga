import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function MentionNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={[styles.container]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.MENTION}
				createdAt={item.post?.createdAt || (item.createdAt as any)}
			/>
			<NotificationPostPeek acct={user} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default MentionNotificationFragment;
