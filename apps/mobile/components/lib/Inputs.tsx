import { APP_FONT } from '../../styles/AppTheme';
import { Input } from '@rneui/themed';

type Props = {
	multiline?: boolean;
	onChangeText?: React.Dispatch<React.SetStateAction<string>>;
	placeholder?: string;
};

/**
 * rneui Input component adapted to
 * our app theme
 * @param props
 * @constructor
 */
function AppInput(props: Props) {
	return (
		<Input
			// @ts-ignore
			multiline={props?.multiline || false}
			placeholder={props?.placeholder || ''}
			containerStyle={{
				borderBottomWidth: 0,
				paddingBottom: 0,
				marginBottom: -16,
			}}
			onChangeText={props.onChangeText}
			inputContainerStyle={{
				borderBottomWidth: 0,
			}}
			inputStyle={{
				paddingHorizontal: 16,
				color: '#fff',
			}}
			style={{
				color: APP_FONT.MONTSERRAT_HEADER,
				fontSize: 16,
				opacity: 0.87,
				marginHorizontal: -8,
				backgroundColor: '#363636',
			}}
			labelStyle={{
				color: '#fff',
			}}
		/>
	);
}

export default AppInput;
