import { CheckBox } from '@rneui/base';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';

type Props = {
	title?: string;
	checked: boolean;
	onPress: () => void;
};

function AppCheckBox(props: Props) {
	return (
		<CheckBox
			checked={props.checked}
			containerStyle={{
				backgroundColor: '#363636',
				borderRadius: 8,
				padding: 8,
			}}
			textStyle={{
				color: APP_FONT.MONTSERRAT_BODY,
				fontFamily: 'Montserrat-Bold',
			}}
			iconRight
			title={props?.title}
			checkedColor={APP_THEME.COLOR_SCHEME_D_EMPHASIS}
			onPress={props.onPress}
		/>
	);
}

export default AppCheckBox;
