import { Image } from 'expo-image';
import ChristmasSantaHat from '#/skins/christmas/decorators/ChristmasSantaHat';
import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useMemo } from 'react';

const TIMELINE_PFP_SIZE = 40; // appDimensions.timelines.avatarIconSize;

function OriginalPosterDecoration({ uri }: { uri: string }) {
	const { skin } = useAppTheme();
	const Decoration = useMemo(() => {
		switch (skin) {
			case 'winter': {
				return (
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
				);
			}
			default:
				return <View />;
		}
	}, [skin]);

	return (
		<View style={{ position: 'relative', flex: 1 }}>
			{Decoration}
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
