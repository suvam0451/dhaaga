import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function ReactionNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.REACTION}
				extraData={item?.extraData}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={post} />
		</View>
	);
}

export default ReactionNotificationFragment;
