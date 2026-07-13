import { Platform } from 'react-native';
import { Host, Switch } from '@expo/ui';
import {
	Host as AndroidHost,
	Switch as AndroidSwitch,
} from '@expo/ui/jetpack-compose';

type AppSwitchProps = {
	value: boolean;
	onValueChange: (value: boolean) => void;
};

function AppSwitch({ value, onValueChange }: AppSwitchProps) {
	if (Platform.OS === 'android') {
		return (
			<AndroidHost matchContents>
				<AndroidSwitch
					value={value}
					colors={{
						checkedThumbColor: '#6200EE',
						checkedTrackColor: '#EDE9FE',
						uncheckedThumbColor: '#9CA3AF',
						uncheckedTrackColor: '#F3F4F6',
						uncheckedBorderColor: '#D1D5DB',
					}}
					onCheckedChange={onValueChange}
				/>
			</AndroidHost>
		);
	} else {
		return (
			<Host matchContents>
				<Switch value={value} onValueChange={onValueChange} />
			</Host>
		);
	}
}

export default AppSwitch;
