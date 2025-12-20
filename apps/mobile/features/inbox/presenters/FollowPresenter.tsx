import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import {
	UngroupedNotificationWithPostProps,
	styles,
} from '../components/_common';
import AuthorItemPresenter from './AuthorItemPresenter';

function FollowPresenter({
	user,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FOLLOW}
				createdAt={createdAt}
			/>
		</View>
	);
}

export default FollowPresenter;
