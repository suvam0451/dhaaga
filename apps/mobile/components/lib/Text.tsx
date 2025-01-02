import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { StyleProp, Text, TextStyle } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppTextVariant,
	AppThemingUtil,
} from '../../utils/theming.util';
import { RandomUtil } from '../../utils/random.utils';

type AppTextProps = {
	key?: any;
	keygen?: boolean;
	color?: string;
	children: any;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
	onPress?: () => void;
	/**
	 * 	indicates that we are using the
	 * 	in-built fonts, which will turn on
	 * 	the fontWeight parameters
	 */
	inherit?: boolean;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
};

export class AppText {
	static BodyNormal({
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

		return (
			<Text
				key={keygen ? RandomUtil.nanoId() : key}
				style={[
					{
						color: _color,
						fontFamily: 'SourceSansPro_400Regular',
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
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);
		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.BODY_MEDIUM,
		);

		return (
			<Text
				key={keygen ? RandomUtil.nanoId() : key}
				style={[_baseStyling, { color: _color }, style]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}

	static H6({
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.H6,
		);

		return (
			<Text
				key={keygen ? RandomUtil.nanoId() : key}
				style={[
					_baseStyling,
					{
						color: _color,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}

	static H1({
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.H1,
		);

		return (
			<Text
				key={keygen ? RandomUtil.nanoId() : key}
				style={[
					_baseStyling,
					{
						color: _color,
					},
					style,
				]}
				numberOfLines={numberOfLines}
			>
				{children}
			</Text>
		);
	}

	static BodyMedium({ style, children, numberOfLines }: AppTextProps) {
		const { theme } = useAppTheme();
		return (
			<Text
				style={[
					{
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

	static Normal({
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();
		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.BODY_NORMAL,
		);

		return (
			<Text
				style={[
					_baseStyling,
					{
						color: _color,
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
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.BODY_SEMIBOLD,
		);

		return (
			<Text
				style={[
					_baseStyling,
					{
						color: _color,
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
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
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
