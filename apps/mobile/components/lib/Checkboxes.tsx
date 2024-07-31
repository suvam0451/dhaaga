import { CheckBox } from '@rneui/base';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';

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

type AppInlineCheckboxProps = {
	label: string;
	checked: boolean;
	onClick: () => void;
};

/**
 * Stylized checkbox,
 * that turn white and add a
 * cross sign at end
 */
export const AppInlineCheckbox = memo(function Foo({
	label,
	checked,
	onClick,
}: AppInlineCheckboxProps) {
	{
		return (
			<View
				style={{
					borderRadius: 8,
					backgroundColor: checked ? 'rgba(170, 170, 170, 0.87)' : '#1e1e1e',
					padding: 8,
					marginRight: 8,
					flex: 0,
					flexDirection: 'row',
					alignItems: 'center',
				}}
				onTouchEnd={onClick}
			>
				<Text
					style={{
						color: checked ? 'rgba(0, 0, 0, 1)' : APP_FONT.MONTSERRAT_BODY,
						fontFamily: 'Montserrat-Bold',
					}}
				>
					{label}
				</Text>
				{checked && (
					<View style={{ marginLeft: 4 }}>
						<Ionicons name="close" size={18} color={'rgba(0, 0, 0, 1)'} />
					</View>
				)}
			</View>
		);
	}
});

export const NativeCheckbox = memo(function Foo({
	label,
	checked,
	onClick,
}: AppInlineCheckboxProps) {
	return (
		<CheckBox
			checked={checked}
			onPress={onClick}
			iconType="material-community"
			checkedIcon="checkbox-outline"
			uncheckedIcon={'checkbox-blank-outline'}
			containerStyle={{
				backgroundColor: '#252525',
				flex: 1,
				margin: 0,
				padding: 0,
				marginLeft: 4,
				marginRight: 0,
				opacity: 0.87,
			}}
			textStyle={{ color: APP_FONT.MONTSERRAT_BODY }}
			title={label}
		/>
	);
});

export default AppCheckBox;
