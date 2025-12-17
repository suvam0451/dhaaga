import APP_ICON_ENUM, { AppIcon } from './Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { APP_FONTS } from '../../styles/AppFonts';
import { useAppTheme } from '../../states/global/hooks';
import { TextInput, View, StyleSheet } from 'react-native';

type AppFormInputProps = {
	leftIcon?: APP_ICON_ENUM;
	placeholder: string;
	onChangeText?: (text: string) => void;
	value?: string;
	isLoading?: boolean;
};

export function AppFormTextInput({
	leftIcon,
	placeholder,
	onChangeText,
	value,
	isLoading,
}: AppFormInputProps) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.inputContainerRoot}>
			{leftIcon && (
				<AppIcon
					id={leftIcon}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					containerStyle={{
						padding: 8,
					}}
				/>
			)}
			<TextInput
				style={{
					fontSize: 16,
					color: theme.secondary.a10,
					textDecorationLine: 'none',
					flex: 1,
				}}
				autoCapitalize={'none'}
				placeholder={placeholder}
				placeholderTextColor={theme.secondary.a30}
				onChangeText={onChangeText}
				value={value}
				editable={!isLoading}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
		marginHorizontal: 6,
	},
});
