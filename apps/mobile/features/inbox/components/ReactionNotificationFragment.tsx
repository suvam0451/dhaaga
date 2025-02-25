import { Props, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import { AppDivider } from '../../../components/lib/Divider';

function ReactionNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.REACTION}
				extraData={item?.extraData}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek post={post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default ReactionNotificationFragment;
