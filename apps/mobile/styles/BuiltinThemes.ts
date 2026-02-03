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
	{
		// -- Catppuccin Latte --
		id: 'ctp_latte',
		name: 'Catppuccin Latte',
		barStyle: 'dark-content',
		background: {
			a0: '#dce0e8', // Crust
			a10: '#e6e9ef', // Mantle
			a20: '#eff1f5', // Base
			a30: '#ccd0da', // Surface 0
			a40: '#bcc0cc', // Surface 1
			a50: '#acb0be', // Surface 2
		},
		reactions: {
			active: '#40a02b', // Green
			inactive: '#ea76cb', // Pink
			highlight: '#d20f39', // Red
		},
		primary: '#7287fd', // Lavender
		primaryText: '#eff1f5', // Base
		complementary: '#209fb5', // Sapphire
		secondary: {
			a0: '#4c4f69', // Text
			a10: '#5c5f77', // Subtext 1
			a20: '#6c6f85', // Subtext 0
			a30: '#7c7f93', // Overlay 2
			a40: '#8c8fa1', // Overlay 1
			a50: '#9ca0b0', // Overlay 0
		},
	},
	{
		// -- Catppuccin Frappé --
		id: 'ctp_frappe',
		name: 'Catppuccin Frappé',
		barStyle: 'light-content',
		background: {
			a0: '#232634', // Crust
			a10: '#292c3c', // Mantle
			a20: '#303446', // Base
			a30: '#414559', // Surface 0
			a40: '#51576d', // Surface 1
			a50: '#626880', // Surface 2
		},
		reactions: {
			active: '#a6d189', // Green
			inactive: '#f4b8e4', // Pink
			highlight: '#f4b8e4', // Red
		},
		primary: '#babbf1', // Lavender
		primaryText: '#303446', // Base
		complementary: '#85c1dc', // Sapphire
		secondary: {
			a0: '#c6d0f5', // Text
			a10: '#b5bfe2', // Subtext 1
			a20: '#a5adce', // Subtext 0
			a30: '#949cbb', // Overlay 2
			a40: '#838ba7', // Overlay 1
			a50: '#737994', // Overlay 0
		},
	},
	{
		// -- Catppuccin Macchiato --
		id: 'ctp_macchiato',
		name: 'Catppuccin Macchiato',
		barStyle: 'light-content',
		background: {
			a0: '#181926', // Crust
			a10: '#1e2030', // Mantle
			a20: '#24273a', // Base
			a30: '#363a4f', // Surface 0
			a40: '#494d64', // Surface 1
			a50: '#5b6078', // Surface 2
		},
		reactions: {
			active: '#a6da95', // Green
			inactive: '#f5bde6', // Pink
			highlight: '#d3ac6c', // Red
		},
		primary: '#b7bdf8', // Lavender
		primaryText: '#24273a', // Base
		complementary: '#7dc4e4', // Sapphire
		secondary: {
			a0: '#cad3f5', // Text
			a10: '#b8c0e0', // Subtext 1
			a20: '#a5adcb', // Subtext 0
			a30: '#939ab7', // Overlay 2
			a40: '#8087a2', // Overlay 1
			a50: '#6e738d', // Overlay 0
		},
	},
	{
		// -- Catppuccin Mocha --
		id: 'ctp_mocha',
		name: 'Catppuccin Mocha',
		barStyle: 'light-content',
		background: {
			a0: '#11111b', // Crust
			a10: '#181825', // Mantle
			a20: '#1e1e2e', // Base
			a30: '#313244', // Surface 0
			a40: '#45475a', // Surface 1
			a50: '#585b70', // Surface 2
		},
		reactions: {
			active: '#a6e3a1', // Green
			inactive: '#f5c2e7', // Pink
			highlight: '#f38ba8', // Red
		},
		primary: '#b4befe', // Lavender
		primaryText: '#1e1e2e', // Base
		complementary: '#74c7ec', // Sapphire
		secondary: {
			a0: '#cdd6f4', // Text
			a10: '#bac2de', // Subtext 1
			a20: '#a6adc8', // Subtext 0
			a30: '#9399b2', // Overlay 2
			a40: '#7f849c', // Overlay 1
			a50: '#6c7086', // Overlay 0
		},
	},
];
