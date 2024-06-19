import { View } from 'react-native';
import { Text } from '@rneui/themed';

function TimelineEmpty() {
	return (
		<View style={{ paddingTop: 54 }}>
			<View
				style={{
					marginHorizontal: 32,
					padding: 10,
					borderRadius: 8,
					backgroundColor: '#1e1e1e',
					marginVertical: 32,
				}}
			>
				<Text style={{ textAlign: 'center' }}>This timeline seems empty</Text>
			</View>
		</View>
	);
}

export default TimelineEmpty;
