import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { StyleProp, Text, TextStyle } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';

export class AppText {
	static Normal({
		style,
		children,
		numberOfLines,
	}: {
		children: any;
		style?: StyleProp<TextStyle>;
		numberOfLines?: number;
	}) {
		const { theme } = useAppTheme();
		return (
			<Text
				style={[
					{
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						color: theme.secondary.a10,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}
	static Medium({
		style,
		children,
		numberOfLines,
	}: {
		children: any;
		style?: StyleProp<TextStyle>;
		numberOfLines?: number;
	}) {
		const { theme } = useAppTheme();
		return (
			<Text
				style={[
					{
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						color: theme.secondary.a10,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}
	static SemiBold({
		style,
		children,
		numberOfLines,
	}: {
		children: any;
		style?: StyleProp<TextStyle>;
		numberOfLines?: number;
	}) {
		const { theme } = useAppTheme();
		return (
			<Text
				style={[
					{
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						color: theme.secondary.a0,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}

	static SemiBoldAlt({
		style,
		children,
		numberOfLines,
	}: {
		children: any;
		style?: StyleProp<TextStyle>;
		numberOfLines?: number;
	}) {
		const { theme } = useAppTheme();
		return (
			<Text
				style={[
					{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						color: theme.secondary.a0,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}
}
