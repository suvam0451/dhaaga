import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { FlingGesture, GestureDetector } from 'react-native-gesture-handler';
import { useMemo } from 'react';
import MediaService from '#/services/media.service';

type Props = {
	src: string;
	alt?: string;
	width: number;
	height: number;
	gesture: FlingGesture;
	maxW: number;
	maxH: number;
};

function CanvasView({ src, height, width, gesture, maxW, maxH }: Props) {
	const { height: _height, width: _width } = useMemo(() => {
		return MediaService.calculateDimensions({
			maxW: maxW,
			maxH: maxH,
			H: height,
			W: width,
		});
	}, [height, width, maxW, maxH]);

	return (
		<View style={{ flex: 1 }}>
			<GestureDetector gesture={gesture}>
				<View style={styles.rootView}>
					<Image
						source={{ uri: src }}
						style={{
							width: _width,
							height: _height,
							borderRadius: 8,
						}}
					/>
				</View>
			</GestureDetector>
		</View>
	);
}

export default CanvasView;

const styles = StyleSheet.create({
	rootView: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
});
