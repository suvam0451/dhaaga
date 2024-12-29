import { CheckBox } from '@rneui/base';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { memo } from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

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
				fontFamily: APP_FONTS.INTER_500_MEDIUM,
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
	const { theme } = useAppTheme();

	const _activeForeground = 'black';
	const _activeBackground = theme.complementary.a0;
	const _inactiveForeground = theme.secondary.a20;
	const _inactiveBackground = '#2c2c2c';

	return (
		<View
			style={{
				borderRadius: 8,
				backgroundColor: checked ? _activeBackground : _inactiveBackground,
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
					color: checked ? _activeForeground : _inactiveForeground,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					paddingHorizontal: 8,
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
});

export const NativeCheckbox = memo(function Foo({
	label,
	checked,
	onClick,
}: AppInlineCheckboxProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<CheckBox
			checked={checked}
			onPress={onClick}
			checkedIcon="dot-circle-o"
			uncheckedIcon="circle-o"
			containerStyle={{
				backgroundColor: theme.palette.menubar,
				flex: 1,
				margin: 0,
				padding: 0,
				marginHorizontal: 'auto',
			}}
			textStyle={{
				color: checked ? theme.textColor.high : theme.textColor.medium,
				fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				marginLeft: 4,
			}}
			checkedColor={theme.reactions.highlight}
			uncheckedColor={theme.textColor.medium}
			title={label}
		/>
	);
});

export default AppCheckBox;
