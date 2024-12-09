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
};

export const APP_DEFAULT_COLOR_SCHEME: AppColorSchemeType = {
	id: 'default',
	name: 'default',
	palette: {
		bg: '#121212',
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
		reactions: {
			active: '#303030',
			inactive: '#161616',
			highlight: '#d3ac6c',
		},
	},
	{
		// 🌸 Sakura 🌸
		id: 'sakura',
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
	},
];
