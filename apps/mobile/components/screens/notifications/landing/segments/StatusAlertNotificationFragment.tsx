import { Props, styles } from './_common';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { AppDivider } from '../../../../lib/Divider';
import AuthorItemPresenter from '../../../../../features/inbox/presenters/AuthorItemPresenter';
import ShareIndicator from '../../../../common/status/fragments/ShareIndicator';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';

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
				notificationType={DhaagaJsNotificationType.STATUS}
				extraData={item?.extraData}
				createdAt={item.createdAt}
			/>
			<NotificationPostPeek acct={user} post={target} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default StatusAlertNotificationFragment;
