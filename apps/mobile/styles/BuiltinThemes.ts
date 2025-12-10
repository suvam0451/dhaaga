import { AppColorSchemeType } from '../utils/theming.util';

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
	background: {
		a0: '#121212', // '#e8b578',
		a10: '#121212',
		a20: '#121212',
		a30: '#121212',
		a40: '#121212',
		a50: '#121212',
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
			menubar: '#1a1a1a', // 13%
			buttonUnstyled: '#2d2c2d', // 424242
			hashtagHigh: 'rgba(248,199,124,0.87)',
			hashtagLow: 'rgba(248,199,124,0.87)',
			link: '#45a0be',
			// #f5f4f6
		},
		background: {
			a0: '#121212', // e8b578, '#121212', // 7%
			a10: '#171717', // e8b578, 9%
			a20: '#1c1c1c', // 11%
			a30: '#212121', // 13%
			a40: '#262626', // 15%
			a50: '#2b2b2b', // 17%, 2b2b2b
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
		background: {
			a0: '#301515',
			a10: '#301515',
			a20: '#301515',
			a30: '#301515',
			a40: '#301515',
			a50: '#301515',
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
