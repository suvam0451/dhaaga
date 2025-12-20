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
	barStyle: 'light-content' | 'dark-content';
	reactions: {
		active: string;
		inactive: string;
		highlight: string;
	};
	primary: string; // hue - 30
	primaryText: string;
	harmonyL?: ColorRangeType; // hue + 30
	harmonyR?: ColorRangeType; // hue + 180 (Complementary, Required)
	complementary: string; // hue - 150 (Split Complementary)

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
	SPECIAL = 'special',

	H6 = 'h6',
	H5 = 'h5',
	H4 = 'h4',
	H3 = 'h3',
	H2 = 'h2',
	H1 = 'h1',
}

export class AppThemingUtil {
	static applyOpacity(colorHex: string, opacity: number) {
		const cleaned = colorHex.replace('#', '');

		const r = parseInt(cleaned.substring(0, 2), 16);
		const g = parseInt(cleaned.substring(2, 4), 16);
		const b = parseInt(cleaned.substring(4, 6), 16);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
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
		if (!store) return '#121212';
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

	/**
	 * Use this for testing/applying typography
	 * @param variant
	 */
	static getBaseStylingForVariant(
		variant: AppTextVariant,
	): StyleProp<TextStyle> {
		switch (variant) {
			case AppTextVariant.BODY_NORMAL:
				return {
					fontSize: 15,
					fontWeight: 'normal',
				};
			case AppTextVariant.BODY_MEDIUM:
				return {
					fontSize: 15,
					fontWeight: 'bold',
				};
			case AppTextVariant.BODY_SEMIBOLD:
				return {
					fontSize: 14,
					fontWeight: 'bold',
				};
			case AppTextVariant.BODY_BOLD:
				return {
					fontSize: 15,
					fontWeight: 'bold',
				};
			case AppTextVariant.H6:
				return {
					fontSize: 20,
					fontWeight: 'bold',
				};
			case AppTextVariant.H5:
				return {
					fontSize: 22,
					fontWeight: 'bold',
				};
			case AppTextVariant.H4:
				return {
					fontSize: 24,
					fontWeight: 'bold',
				};
			case AppTextVariant.H3:
				return {
					fontSize: 26,
					fontWeight: 'bold',
				};
			case AppTextVariant.H2:
				return {
					fontSize: 28,
					fontWeight: 'bold',
				};
			case AppTextVariant.H1:
				return {
					fontSize: 30,
					fontWeight: 'bold',
				};
		}
	}
}
