import { styles, UngroupedNotificationWithUserProps } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function FollowReqAcceptNotificationFragment({
	user,
	createdAt,
}: UngroupedNotificationWithUserProps) {
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FOLLOW_REQUEST_ACCEPTED}
				createdAt={createdAt}
			/>
		</View>
	);
}

export default FollowReqAcceptNotificationFragment;
