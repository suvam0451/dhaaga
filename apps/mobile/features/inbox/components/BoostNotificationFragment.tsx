import { Props, styles } from './_common';
import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import { AppDivider } from '../../../components/lib/Divider';
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
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default BoostNotificationFragment;
