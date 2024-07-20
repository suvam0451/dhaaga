import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { ButtonGroup } from '@rneui/themed';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	options: string[];
	selectedIndex: number;
	onPress: Dispatch<SetStateAction<number>>;
};

function AppButtonGroup(props: Props) {
	return (
		<ButtonGroup
			activeOpacity={1}
			selectedButtonStyle={{
				backgroundColor: APP_THEME.COLOR_SCHEME_B,
			}}
			selectedTextStyle={{
				color: APP_FONT.MONTSERRAT_BODY,
				fontFamily: 'Montserrat-Bold',
			}}
			buttons={props.options}
			selectedIndex={props.selectedIndex}
			onPress={props.onPress}
			containerStyle={{
				padding: 0,
				borderColor: APP_THEME.COLOR_SCHEME_B,
			}}
			buttonContainerStyle={{
				padding: 0,
				borderColor: APP_THEME.COLOR_SCHEME_B,
			}}
			buttonStyle={{ padding: 0, backgroundColor: '#303030' }}
			textStyle={{ padding: 0, color: APP_THEME.COLOR_SCHEME_D_EMPHASIS }}
		/>
	);
}

export default AppButtonGroup;
