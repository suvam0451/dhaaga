import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { View } from 'react-native';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';

function FollowNotificationFragment({ item }: Props) {
	const user = item.user;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DhaagaJsNotificationType.FOLLOW}
				createdAt={item.createdAt}
			/>
		</View>
	);
}

export default FollowNotificationFragment;
