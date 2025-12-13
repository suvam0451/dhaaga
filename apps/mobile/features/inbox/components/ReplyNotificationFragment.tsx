import { Props, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from './NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function ReplyNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REPLY}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default ReplyNotificationFragment;
