import { AppColorSchemeType } from '../utils/theming.util';

export const APP_BUILT_IN_THEMES: AppColorSchemeType[] = [
	{
		// -- Default --
		id: 'default',
		name: 'Default',
		barStyle: 'light-content',
		background: {
			a0: '#121212', // e8b578, '#121212', // 7%
			a10: '#171717', // e8b578, 9%
			a20: '#1c1c1c', // 11%
			a30: '#212121', // 13%
			a40: '#262626', // 15%
			a50: '#2b2b2b', // 17%, 2b2b2b
		},
		reactions: {
			active: '#303030',
			inactive: '#161616',
			highlight: '#d3ac6c',
		},
		primary: '#e7cf8e', // '#e7cf8e', '#f8e0a3', '#f9e4ae', '#fae7ba', '#fcebc5', '#fdefd1',
		primaryText: 'black',
		complementary: '#97b0f6',
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
		// -- Default --
		id: 'christmas',
		name: 'Christmas',
		barStyle: 'dark-content',
		background: {
			a0: '#EAEBDB', // e8b578, '#121212', // 7%
			a10: '#EEE7C9', // e8b578, 9%
			a20: '#EFE1B3', // 11%
			a30: '#F0DA9C', // 13%
			a40: '#F0D385', // 15%
			a50: '#E9CC89', // 17%, 2b2b2b
		},
		reactions: {
			active: '#303030',
			inactive: '#161616',
			highlight: '#d3ac6c',
		},
		primary: '#B11226', // '#e7cf8e', '#f8e0a3', '#f9e4ae', '#fae7ba', '#fcebc5', '#fdefd1',
		primaryText: 'white',
		complementary: '#1b8d27', // B11226
		secondary: {
			a0: '#1f341c',
			a10: '#293a22',
			a20: '#334027',
			a30: '#3c452d',
			a40: '#464b32',
			a50: '#305633',
		},
	},
	{
		// 🌸 Sakura 🌸
		id: 'RXLexZ2gHT7HMio0mvr0y',
		barStyle: 'dark-content',
		name: 'Sakura',
		background: {
			a0: '#301515',
			a10: '#301515',
			a20: '#301515',
			a30: '#301515',
			a40: '#301515',
			a50: '#301515',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
		primary: '#f6dc97', // '#f6dc97', '#f8e0a3', '#f9e4ae', '#fae7ba', '#fcebc5', '#fdefd1',
		primaryText: 'black',
		complementary: '#97b0f6',
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
		id: 'white_album_2',
		name: 'White Album',
		barStyle: 'dark-content',
		background: {
			a0: '#fffdf8',
			a10: '#e6e9e2',
			a20: '#cbd6d1',
			a30: '#b0c3c0',
			a40: '#95b0af',
			a50: '#9EC5D1',
		},
		primary: '#854B39',
		primaryText: '#9EC5D1',
		complementary: '#142c72', // f9ba4f
		secondary: {
			a0: '#134358', // #91954a, 56563c
			a10: '#15487F',
			a20: '#174D66',
			a30: '#19526D',
			a40: '#1B5774',
			a50: '#1B5D79',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
	},
	{
		id: 'beast_within',
		name: 'Beast Within',
		barStyle: 'light-content',
		primary: '#fef5ad',
		primaryText: 'black',
		complementary: '#a67666',
		background: {
			a0: '#121212',
			a10: '#141718',
			a20: '#151c1e',
			a30: '#162124',
			a40: '#172329',
			a50: '#182629',
		},
		secondary: {
			a0: '#c0dbc3',
			a10: '#b2d0b6',
			a20: '#a3c4a7',
			a30: '#94b898',
			a40: '#88ad8a',
			a50: '#7ca176',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
	},
	{
		id: 'kataware_doki',
		name: 'Kataware Doki',
		barStyle: 'light-content',
		primary: '#fcaf88',
		primaryText: '#000000',
		complementary: '#90CEEE',
		background: {
			a0: '#4f0b3f',
			a10: '#5c1648',
			a20: '#692254',
			a30: '#762e5f',
			a40: '#823a69',
			a50: '#853963',
		},
		secondary: {
			a0: '#fef1b7',
			a10: '#f9deb2',
			a20: '#efc7b1',
			a30: '#d9a4b2',
			a40: '#b881a1',
			a50: '#9d7290',
		},
		reactions: {
			active: '#492916',
			inactive: '#301515',
			highlight: '#f8d3e4',
		},
	},
];
