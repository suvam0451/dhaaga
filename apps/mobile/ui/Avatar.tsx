import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const TIMELINE_PFP_SIZE = 40; // appDimensions.timelines.avatarIconSize;

type Props = {
	uri: string;
	onPressed?: () => void;
	onLongPressed?: () => void;
};

function Avatar({ uri, onPressed, onLongPressed }: Props) {
	return (
		<TouchableOpacity
			onPress={onPressed}
			onLongPress={onLongPressed}
			style={styles.avatar}
		>
			<Image
				style={{
					flex: 1,
					padding: 2,
					borderRadius: TIMELINE_PFP_SIZE / 2,
				}}
				source={{ uri }}
			/>
		</TouchableOpacity>
	);
}

export default Avatar;

const styles = StyleSheet.create({
	avatar: {
		width: TIMELINE_PFP_SIZE,
		height: TIMELINE_PFP_SIZE,
		borderColor: 'rgba(200, 200, 200, 0.3)',
		borderWidth: 1,
		borderRadius: TIMELINE_PFP_SIZE / 2,
		flexShrink: 1,
	},
});
