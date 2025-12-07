import { Props, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import { AppDivider } from '../../../components/lib/Divider';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import ShareIndicator from '../../../components/common/status/fragments/ShareIndicator';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';

function StatusAlertNotificationFragment({ item }: Props) {
	const post = item.post;

	const IS_BOOST = post.meta.isBoost;

	const target = PostMiddleware.getContentTarget(post);

	const user = target.postedBy;

	return (
		<View style={styles.container}>
			{IS_BOOST && (
				<ShareIndicator
					parsedDisplayName={post?.postedBy?.parsedDisplayName}
					createdAt={post?.createdAt}
					avatarUrl={post?.postedBy?.avatarUrl}
				/>
			)}
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.STATUS}
				extraData={item?.extraData}
				createdAt={item.createdAt}
				noIcon
			/>
			<NotificationPostPeek post={target} />
		</View>
	);
}

export default StatusAlertNotificationFragment;
