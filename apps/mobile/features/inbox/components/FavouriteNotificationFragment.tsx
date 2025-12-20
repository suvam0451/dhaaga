import { UngroupedNotificationWithPostProps, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from './NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function FavouriteNotificationFragment({
	user,
	post,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FAVOURITE}
				createdAt={createdAt}
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default FavouriteNotificationFragment;
