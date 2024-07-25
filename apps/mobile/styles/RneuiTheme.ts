import { createTheme } from '@rneui/themed';
import { APP_FONTS } from './AppFonts';

const RneuiTheme = createTheme({
	lightColors: {
		primary: 'red',
	},
	darkColors: {
		primary: 'blue',
	},
	components: {
		Button: {
			raised: true,
		},
		Text: {
			style: {
				color: '#fff',
				opacity: 0.87,
				fontFamily: APP_FONTS.INTER_400_REGULAR,
			},
		},
		Skeleton: {
			style: {
				backgroundColor: '#fff',
				opacity: 0.3,
			},
			animation: 'pulse',
		},
	},
});

export default RneuiTheme;
