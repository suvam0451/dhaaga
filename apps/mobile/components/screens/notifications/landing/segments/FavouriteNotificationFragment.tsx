import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function FavouriteNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.FAVOURITE}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default FavouriteNotificationFragment;
