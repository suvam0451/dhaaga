import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';
import EmptyFileSvg from '#/components/svgs/topaz-empty-state/EmptyFile';

function EmptyNotificationsView() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ height: 148, width: '100%' }}>
				<EmptyFileSvg />
			</View>
			<AppText.Normal>Notification List Empty</AppText.Normal>
		</View>
	);
}

export default EmptyNotificationsView;
