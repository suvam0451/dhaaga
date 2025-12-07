import { Props, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { AppDivider } from '../../../components/lib/Divider';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function FollowReqAcceptNotificationFragment({ item }: Props) {
	const user = item.user;
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FOLLOW_REQUEST_ACCEPTED}
				createdAt={item.createdAt}
			/>
		</View>
	);
}

export default FollowReqAcceptNotificationFragment;
