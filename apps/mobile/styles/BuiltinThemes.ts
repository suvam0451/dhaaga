export enum APP_COLOR_PALETTE_EMPHASIS {
	A0 = 'a0',
	A10 = 'a10',
	A20 = 'a20',
	A30 = 'a30',
	A40 = 'a40',
	A50 = 'a50',
}

type ColorRangeType = {
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
	primary: ColorRangeType;
	// hue - 30
	harmonyL?: ColorRangeType;
	// hue + 30
	harmonyR?: ColorRangeType;
	// hue + 180 (Complementary, Required)
	complementary: ColorRangeType;
	// hue - 150 (Split Complementary)
	complementaryA: ColorRangeType | null;
	// hue + 150 (Split Complementary)
	complementaryB?: ColorRangeType;

	secondary: ColorRangeType;
};

export const APP_DEFAULT_COLOR_SCHEME: AppColorSchemeType = {
	id: 'default',
	name: 'default',
	palette: {
		bg: '#121212`',
		menubar: '#292929', // #262626 Threads (15%)
		buttonUnstyled: '#424242',
		hashtagHigh: 'rgba(248,199,124,0.87)',
		hashtagLow: 'rgba(248,199,124,0.87)',
		link: '#45a0be',
	},
	textColor: {
		high: '#f5f5f5',
		medium: '#999999',
		emphasisC: '#7a7a7a',
		low: '#5c5c5c',
		misc: '#212121',
	},
	reactions: {
		active: '#303030',
		inactive: '#161616',
		highlight: '#d3ac6c',
	},
	secondary: {
		a0: '#f5f5f5',
		a10: '#d7d7d7',
		a20: '#b9b9b9',
		a30: '#9c9c9c',
		a40: '#808080',
		a50: '#656565',
	},
	primary: {
		a0: '#d9c286',
		a10: '#f8e0a3',
		a20: '#f9e4ae',
		a30: '#fae7ba',
		a40: '#fcebc5',
		a50: '#fdefd1',
	},
	complementary: {
		a0: '#97b0f6',
		a10: '#a3b8f7',
		a20: '#b0c1f8',
		a30: '#bbcaf9',
		a40: '#c7d2fb',
		a50: '#d2dbfc',
	},

	complementaryB: {
		a0: '#97e0f6',
		a10: '#a4e4f7',
		a20: '#b0e7f8',
		a30: '#bceaf9',
		a40: '#c8eefa',
		a50: '#d3f1fb',
	},
	complementaryA: {
		a0: '#97e0f6',
		a10: '#a4e4f7',
		a20: '#b0e7f8',
		a30: '#bceaf9',
		a40: '#c8eefa',
		a50: '#d3f1fb',
	},
};

export const APP_BUILT_IN_THEMES: AppColorSchemeType[] = [
	{
		// -- Default --
		id: 'default',
		name: 'Default',
		palette: {
			bg: '#121212', // 7%
			menubar: '#212121', // 13%
			buttonUnstyled: '#2d2c2d', // 424242
			hashtagHigh: 'rgba(248,199,124,0.87)',
			hashtagLow: 'rgba(248,199,124,0.87)',
			link: '#45a0be',
			// #f5f4f6
		},
		textColor: {
			high: '#f5f5f5', // 96%
			medium: '#bdbdbd', // #9f9e9f  Threads --> #bdbdbd (74%), #999999 Previous (60%)
			emphasisC: '#9f9e9f', // 62%
			low: '#5c5c5c',
			misc: '#3d3d3d',
		},
		harmonyL: {
			a0: '#f6ad97',
			a10: '#f8b6a2',
			a20: '#fabfad',
			a30: '#fbc8b9',
			a40: '#fdd1c4',
			a50: '#fedad0',
		},
		harmonyR: {
			a0: '#e0f697',
			a10: '#e4f7a3',
			a20: '#e8f8af',
			a30: '#ebf9ba',
			a40: '#effac6',
			a50: '#f2fbd1',
		},
		reactions: {
			active: '#303030',
			inactive: '#161616',
			highlight: '#d3ac6c',
		},
		primary: {
			a0: '#e7cf8e',
			a10: '#f8e0a3',
			a20: '#f9e4ae',
			a30: '#fae7ba',
			a40: '#fcebc5',
			a50: '#fdefd1',
		},
		complementary: {
			a0: '#97b0f6',
			a10: '#a3b8f7',
			a20: '#b0c1f8',
			a30: '#bbcaf9',
			a40: '#c7d2fb',
			a50: '#d2dbfc',
		},
		complementaryB: {
			a0: '#ad97f6',
			a10: '#b7a2f7',
			a20: '#c0adf9',
			a30: '#cab9fa',
			a40: '#d3c4fb',
			a50: '#dcd0fc',
		},
		complementaryA: {
			a0: '#ad97f6',
			a10: '#b7a2f7',
			a20: '#c0adf9',
			a30: '#cab9fa',
			a40: '#d3c4fb',
			a50: '#dcd0fc',
		},
		secondary: {
			a0: '#f5f5f5',
			a10: '#d7d7d7',
			a20: '#b9b9b9',
			a30: '#9c9c9c',
			a40: '#808080',
			a50: '#656565',
		},
	},
	{
		// 🌸 Sakura 🌸
		id: 'RXLexZ2gHT7HMio0mvr0y',
		name: 'Sakura',
		palette: {
			bg: '#301515', // 7 --> 14%, 301515
			menubar: '#492322',
			buttonUnstyled: '#922740',
			hashtagHigh: '#fea7a6',
			hashtagLow: '#dc9497',
			link: '#9c6e5c',
		},
		textColor: {
			high: '#fcc', // 96 --> 92%, ffd6d6
			medium: '#e7a7b4', // 74 --> 78%
			emphasisC: '#aa874b', // 48
			low: '#aa874b', // 36 --> 48%, 936762
			misc: '#554425',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
		primary: {
			a0: '#f6dc97',
			a10: '#f8e0a3',
			a20: '#f9e4ae',
			a30: '#fae7ba',
			a40: '#fcebc5',
			a50: '#fdefd1',
		},
		complementary: {
			a0: '#97b0f6',
			a10: '#a3b8f7',
			a20: '#b0c1f8',
			a30: '#bbcaf9',
			a40: '#c7d2fb',
			a50: '#d2dbfc',
		},
		complementaryA: {
			a0: '#97e0f6',
			a10: '#a4e4f7',
			a20: '#b0e7f8',
			a30: '#bceaf9',
			a40: '#c8eefa',
			a50: '#d3f1fb',
		},
		complementaryB: {
			a0: '#97e0f6',
			a10: '#a4e4f7',
			a20: '#b0e7f8',
			a30: '#bceaf9',
			a40: '#c8eefa',
			a50: '#d3f1fb',
		},
		secondary: {
			a0: '#f5f5f5',
			a10: '#d7d7d7',
			a20: '#b9b9b9',
			a30: '#9c9c9c',
			a40: '#808080',
			a50: '#656565',
		},
	},
];
