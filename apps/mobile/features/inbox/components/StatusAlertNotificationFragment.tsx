import { UngroupedNotificationWithPostProps, styles } from './_common';
import { View } from 'react-native';
import { DriverNotificationType, PostInspector } from '@dhaaga/bridge';
import { NotificationPostPeek } from '#/features/inbox/components/NotificationPostPeek';
import AuthorItemPresenter from '../presenters/AuthorItemPresenter';
import ShareIndicator from '#/components/common/status/fragments/ShareIndicator';

function StatusAlertNotificationFragment({
	user,
	post,
	createdAt,
	extraData,
}: UngroupedNotificationWithPostProps) {
	const IS_BOOST = post.meta.isBoost;
	const target = PostInspector.getContentTarget(post);

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
				extraData={extraData}
				createdAt={createdAt}
				noIcon
			/>
			<NotificationPostPeek post={target} />
		</View>
	);
}

export default StatusAlertNotificationFragment;
