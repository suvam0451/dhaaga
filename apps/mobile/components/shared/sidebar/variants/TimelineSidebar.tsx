import AppSidebarFactory from '../fragments/AppSidebarFactory';
import { View } from 'react-native';
import { Text } from '@rneui/themed';

function TimelineSidebarPageActions() {
	return (
		<View>
			<View>
				<Text>Sensitive Content</Text>
			</View>
		</View>
	);
}

type Props = {
	children: any;
};

function TimelineSidebar({ children }: Props) {
	return (
		<AppSidebarFactory PageActions={<TimelineSidebarPageActions />}>
			{children}
		</AppSidebarFactory>
	);
}

export default TimelineSidebar;
