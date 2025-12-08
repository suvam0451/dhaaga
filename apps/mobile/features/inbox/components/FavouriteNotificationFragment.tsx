import { Props, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import { AppDivider } from '../../../components/lib/Divider';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function FavouriteNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FAVOURITE}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default FavouriteNotificationFragment;
