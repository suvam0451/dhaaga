import { Props, styles } from './_common';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function BoostNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.REBLOG}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek post={post?.boostedFrom || post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default BoostNotificationFragment;
