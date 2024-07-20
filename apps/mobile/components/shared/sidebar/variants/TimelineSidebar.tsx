import AppSidebarFactory from '../fragments/AppSidebarFactory';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { SingleChoiceSetting } from '../../settings/Factory';
import { APP_SETTINGS } from '../../../../types/app.types';

function TimelineSidebarPageActions() {
	return (
		<View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					fontSize: 20,
					color: APP_FONT.MONTSERRAT_HEADER,
					marginBottom: 4,
				}}
			>
				Timeline Settings
			</Text>
			<SingleChoiceSetting
				label={'Sensitive Content'}
				settingKey={APP_SETTINGS.TIMELINE_SENSITIVE_CONTENT}
				items={[
					{
						label: 'Hide',
						id: 'hide',
					},
					{
						label: 'Show',
						id: 'show',
					},
				]}
			/>
			<SingleChoiceSetting
				label={'Content Warnings'}
				settingKey={APP_SETTINGS.TIMELINE_CONTENT_WARNING}
				items={[
					{
						label: 'Hide',
						id: 'hide',
					},
					{
						label: 'Show',
						id: 'show',
					},
				]}
			/>
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
