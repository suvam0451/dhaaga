import { DriverNotificationType } from '@dhaaga/bridge';
import { View } from 'react-native';
import { Props, styles } from '../components/_common';
import { AppDivider } from '../../../components/lib/Divider';
import AuthorItemPresenter from './AuthorItemPresenter';

function FollowPresenter({ item }: Props) {
	const user = item.user;
	return (
		<View style={styles.container}>
			<AuthorItemPresenter
				user={user}
				notificationType={DriverNotificationType.FOLLOW}
				createdAt={item.createdAt}
			/>
		</View>
	);
}

export default FollowPresenter;
