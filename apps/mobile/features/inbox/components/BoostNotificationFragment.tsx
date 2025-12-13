import { Props, styles } from './_common';
import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { NotificationPostPeek } from '#/features/inbox/components/NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function BoostNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REBLOG}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek post={post?.boostedFrom || post} />
		</View>
	);
}

export default BoostNotificationFragment;
