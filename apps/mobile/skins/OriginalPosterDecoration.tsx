import { Image } from 'expo-image';
import ChristmasSantaHat from '#/skins/christmas/decorators/ChristmasSantaHat';
import { View } from 'react-native';

const TIMELINE_PFP_SIZE = 40; // appDimensions.timelines.avatarIconSize;

function OriginalPosterDecoration({ uri }: { uri: string }) {
	return (
		<View style={{ position: 'relative', flex: 1 }}>
			<View
				style={{
					position: 'absolute',
					width: 48,
					height: 48,
					zIndex: 1,
					top: -TIMELINE_PFP_SIZE + 12,
					left: -12,
					transform: [{ scaleX: -1 }],
				}}
			>
				<ChristmasSantaHat />
			</View>
			<Image
				style={{
					flex: 1,
					padding: 2,
					borderRadius: TIMELINE_PFP_SIZE / 2,
				}}
				source={{ uri }}
			/>
		</View>
	);
}

export default OriginalPosterDecoration;
