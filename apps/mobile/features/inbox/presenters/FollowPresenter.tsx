import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import {
	UngroupedNotificationWithPostProps,
	styles,
} from '../components/_common';
import AuthorItemPresenter from './AuthorItemPresenter';
import { useAppTheme } from '#/states/global/hooks';

function FollowPresenter({
	user,
	createdAt,
}: UngroupedNotificationWithPostProps) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme.background.a0 }]}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FOLLOW}
				createdAt={createdAt}
			/>
		</View>
	);
}

export default FollowPresenter;
