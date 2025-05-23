import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { StyleProp, Text, TextStyle } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppTextVariant,
	AppThemingUtil,
} from '../../utils/theming.util';
import { RandomUtil } from '@dhaaga/bridge';
import { useTranslation } from 'react-i18next';

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
	onTextLayout?: (e: any) => void;
};

export class AppText {
	/**
	 * The unique BebasNeue font used for
	 * some of the headers throughout
	 * the app
	 * @constructor
	 */
	static Special({
		key,
		keygen,
		style,
		color,
		children,
		numberOfLines,
		emphasis,
	}: AppTextProps) {
		const { theme } = useAppTheme();
		const { i18n } = useTranslation();

		let _color =
			color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);
		let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
			AppTextVariant.BODY_MEDIUM,
		);

		const FONT_INCOMPATIBLE = ['jp'].includes(i18n.language);
		return (
			<Text
				key={keygen ? RandomUtil.nanoId() : key}
				style={[
					_baseStyling,
					{
						color: _color,
						fontFamily: FONT_INCOMPATIBLE
							? APP_FONTS.ROBOTO_500
							: APP_FONTS.BEBAS_NEUE_400,
						fontSize: FONT_INCOMPATIBLE ? 18 : 22,
					},
					style,
				]}
				numberOfLines={numberOfLines}
				textBreakStrategy={'simple'}
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
		onPress,
		onTextLayout,
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
				textBreakStrategy={'simple'}
				onPress={onPress}
				onTextLayout={onTextLayout}
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
				textBreakStrategy={'simple'}
			>
				{children}
			</Text>
		);
	}

	static Normal({
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
				textBreakStrategy={'simple'}
			>
				{children}
			</Text>
		);
	}

	static SemiBold({
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

	static SemiBoldAlt({ style, children, numberOfLines }: AppTextProps) {
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
