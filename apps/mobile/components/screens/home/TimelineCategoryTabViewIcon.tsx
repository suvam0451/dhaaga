import { View } from 'react-native';

type Props = {
	selected: boolean;
	Icon: any;
};

function TimelineCategoryTabViewIcon({ Icon }: Props) {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ width: 24 }}>{Icon}</View>
		</View>
	);
}

export default TimelineCategoryTabViewIcon;
