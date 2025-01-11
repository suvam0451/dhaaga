/**
 * The color system of Dhaaga uses a primary
 * accept color and a contrasting palette
 * (mainly analogous) of three colors.
 *
 * The complementary colors drive the general
 * vibe of the app, while the accent color is
 * used for most important elements in the user's
 * screen.
 *
 *
 * Surface
 * ---
 * Mostly darker shades of black. I haven't
 * experimented much with tonal surface colors
 * for dark themes.
 * - used as base background, bottom sheet
 * - used to represent elevation
 *
 *
 * Complementary + A/B
 * ---
 * Grab the opposite end of the color wheel and
 * shift the hue by +/- 30 to get this palette
 */
import { APP_FONTS } from '../styles/AppFonts';
import { StyleProp, TextStyle } from 'react-native';
import { commentThreadPalette } from '../styles/comment-threads';

export enum APP_COLOR_PALETTE_EMPHASIS {
	A0 = 'a0',
	A10 = 'a10',
	A20 = 'a20',
	A30 = 'a30',
	A40 = 'a40',
	A50 = 'a50',
}

export type ColorRangeType = {
	a0: string;
	a10: string;
	a20: string;
	a30: string;
	a40: string;
	a50: string;
};

export type AppColorSchemeType = {
	id: string;
	name: string;
	palette: {
		bg: string;
		menubar: string;
		buttonUnstyled: string;
		hashtagLow: string;
		hashtagHigh: string;
		link: string;
	};
	textColor: {
		high: string; // 96%
		medium: string; // 74%
		emphasisC: string; // 48%
		low: string; // 36%
		misc: string; // 12%
	};
	reactions: {
		active: string;
		inactive: string;
		highlight: string;
	};
	primary: ColorRangeType; // hue - 30
	harmonyL?: ColorRangeType; // hue + 30
	harmonyR?: ColorRangeType; // hue + 180 (Complementary, Required)
	complementary: ColorRangeType; // hue - 150 (Split Complementary)
	complementaryA: ColorRangeType | null; // hue + 150 (Split Complementary)
	complementaryB?: ColorRangeType;

	surface?: ColorRangeType;
	secondary: ColorRangeType;

	// represents elevation in dark mode
	background: ColorRangeType;
};

export enum AppTextVariant {
	BODY_NORMAL = 'body.normal',
	BODY_MEDIUM = 'body.medium',
	BODY_SEMIBOLD = 'body.semibold',
	BODY_BOLD = 'body.bold',

	H6 = 'h6',
	H5 = 'h5',
	H4 = 'h4',
	H3 = 'h3',
	H2 = 'h2',
	H1 = 'h1',
}

export class AppThemingUtil {
	static getThreadColorForDepth(depth: number): string {
		const n = commentThreadPalette.length; // Get the length of the array

		// Normalize the rotation number to avoid unnecessary large rotations
		const rotatedIndex = depth % n;

		// Return the color at the new index after rotation
		return commentThreadPalette[rotatedIndex];
	}

	static getColorForEmphasis(
		store: ColorRangeType,
		emphasis: APP_COLOR_PALETTE_EMPHASIS,
	) {
		try {
			if (!emphasis) return store[APP_COLOR_PALETTE_EMPHASIS.A0];
			return store[emphasis];
		} catch (e) {
			return store[0];
		}
	}

	static generateRandomColorHex() {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16);
		return '#' + ('000000' + randomColor).slice(-6);
	}

	static getFontFamilyForVariant(variant: AppTextVariant) {
		switch (variant) {
			case AppTextVariant.BODY_NORMAL:
			case AppTextVariant.BODY_MEDIUM:
			case AppTextVariant.BODY_SEMIBOLD:
			case AppTextVariant.BODY_BOLD:
				return undefined;
			case AppTextVariant.H6:
			case AppTextVariant.H5:
			case AppTextVariant.H4:
			case AppTextVariant.H3:
			case AppTextVariant.H2:
			case AppTextVariant.H1:
				return APP_FONTS.INTER_600_SEMIBOLD;
		}
	}

	/**
	 * Use this for testing/applying typography
	 * @param variant
	 */
	static getBaseStylingForVariant(
		variant: AppTextVariant,
	): StyleProp<TextStyle> {
		switch (variant) {
			case AppTextVariant.BODY_NORMAL:
				return { fontSize: 14, fontFamily: APP_FONTS.INTER_400_REGULAR };
			case AppTextVariant.BODY_MEDIUM:
				return { fontSize: 14, fontFamily: APP_FONTS.ROBOTO_500 };
			case AppTextVariant.BODY_SEMIBOLD:
				return { fontSize: 14, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.BODY_BOLD:
				return { fontSize: 14, fontFamily: APP_FONTS.INTER_700_BOLD };
			case AppTextVariant.H6:
				return { fontSize: 18, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.H5:
				return { fontSize: 20, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.H4:
				return { fontSize: 22, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.H3:
				return { fontSize: 24, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.H2:
				return { fontSize: 26, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			case AppTextVariant.H1:
				return { fontSize: 28, fontFamily: APP_FONTS.INTER_600_SEMIBOLD };
			// return { fontSize: 30, fontFamily: APP_FONTS.SOURCE_SANS_PRO_600 };
			// return { fontSize: 28, fontFamily: 'PublicSans_600SemiBold' };
		}
	}
}
