import { memo } from 'react';
import { View } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { Props, styles } from './_common';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';

const MentionNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<NotificationSenderInterface
				acct={acct}
				type={DhaagaJsNotificationType.MENTION}
			/>
			<NotificationDescriptionText type={DhaagaJsNotificationType.MENTION} />
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default MentionNotificationFragment;
