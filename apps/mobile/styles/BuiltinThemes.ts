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
		high: string;
		medium: string;
		low: string;
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
		menubar: '#1c1c1c',
		buttonUnstyled: '#424242',
		hashtagHigh: 'rgba(248,199,124,0.87)',
		hashtagLow: 'rgba(248,199,124,0.87)',
		link: '#45a0be',
	},
	textColor: {
		high: '#f5f5f5',
		medium: '#999999',
		low: '#606060',
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
			bg: '#121212',
			menubar: '#1c1c1c',
			buttonUnstyled: '#424242',
			hashtagHigh: 'rgba(248,199,124,0.87)',
			hashtagLow: 'rgba(248,199,124,0.87)',
			link: '#45a0be',
		},
		textColor: {
			high: '#f5f5f5',
			medium: '#999999',
			low: '#606060',
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
			bg: '#301515',
			menubar: '#492322',
			buttonUnstyled: '#922740',
			hashtagHigh: '#fea7a6',
			hashtagLow: '#dc9497',
			link: '#9c6e5c',
		},
		textColor: {
			high: '#ffdcdc',
			medium: '#e6a3b0',
			low: '#db7b8e',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
	},
];
