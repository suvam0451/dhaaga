import { useAppTheme } from '#/states/global/hooks';
import { StyleProp, Text, TextStyle } from 'react-native';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppTextVariant,
	AppThemingUtil,
} from '#/utils/theming.util';
import { RandomUtil } from '@dhaaga/bridge';

type AppTextProps = {
	forwardedKey?: any;
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
	static Medium({
		forwardedKey,
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
				key={keygen ? RandomUtil.nanoId() : forwardedKey}
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
}
