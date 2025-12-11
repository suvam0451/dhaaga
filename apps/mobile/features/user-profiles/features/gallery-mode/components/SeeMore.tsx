import { View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';

function SeeMore() {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: 72,
				height: 72,
				marginHorizontal: 4,
				borderColor: theme.background.a50,
				borderWidth: 1,
				borderRadius: 4,
			}}
		>
			<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
				See
			</AppText.Medium>
			<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
				More
			</AppText.Medium>
		</View>
	);
}

export default SeeMore;
