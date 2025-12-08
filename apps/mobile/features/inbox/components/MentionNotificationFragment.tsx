import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { Props, styles } from './_common';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import { AppDivider } from '../../../components/lib/Divider';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';

function MentionNotificationFragment({ item }: Props) {
	const user = item.user;
	const post = item.post;

	return (
		<View style={[styles.container]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.MENTION}
				createdAt={item.createdAt}
				extraData={item.extraData}
				noIcon
			/>
			<NotificationPostPeek post={post} />
		</View>
	);
}

export default MentionNotificationFragment;
