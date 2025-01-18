import { View } from 'react-native';
import { AppText } from '../../../../../components/lib/Text';

function SeeMore() {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: 64,
				height: 64,
				marginHorizontal: 4,
				borderColor: 'gray',
				borderWidth: 1,
				borderRadius: 4,
			}}
		>
			<AppText.SemiBold>See</AppText.SemiBold>
			<AppText.SemiBold>More</AppText.SemiBold>
		</View>
	);
}

export default SeeMore;
