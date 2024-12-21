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
};

export class AppThemingUtil {
	static getColorForEmphasis(
		store: ColorRangeType,
		emphasis: APP_COLOR_PALETTE_EMPHASIS,
	) {
		try {
			if (!emphasis) return store[0];
			return store[emphasis];
		} catch (e) {
			return store[0];
		}
	}
}
