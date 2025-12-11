type ColorRangeType = {
	a0: string;
	a10: string;
	a20: string;
	a30: string;
	a40: string;
	a50: string;
};

export type DhaagaColorSchemeType = {
	id: string;
	name: string;
	palette: {
		/**
		 * background for everything, including the top
		 * and bottom navigation bars
		 */
		bg: string;
		/**
		 * this is used by the fixed bottom menubar,
		 * as well as the sticky navbar at the top
		 * for many screens
		 */
		menubar: string;
		/**
		 * This is the color that prominently appears
		 * on top of cta buttons (yellow in the default
		 * skin)
		 */
		primary: string;
		/**
		 * appears for a hashtag that you do not follow
		 * (applicable to select drivers only)
		 */
		hashtagLow: string;
		/**
		 * theming for hashtags that you follow
		 * (applicable to select drivers only)
		 */
		hashtagHigh: string;
		/**
		 * theming for link objects
		 */
		link: string;
		/**
		 * theming for mention objects
		 *
		 * NOTE: when you are mentioned, it is
		 * always styled as the primary color
		 *
		 */
		mention: string;
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
	primary: string; // hue - 30
	harmonyL?: ColorRangeType; // hue + 30
	harmonyR?: ColorRangeType; // hue + 180 (Complementary, Required)
	complementary: string; // hue - 150 (Split Complementary)
	complementaryA: ColorRangeType | null; // hue + 150 (Split Complementary)
	complementaryB?: ColorRangeType;

	surface?: ColorRangeType;
	secondary: ColorRangeType;

	// represents elevation in dark mode
	background: ColorRangeType;
};
