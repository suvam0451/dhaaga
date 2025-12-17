import { View, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import useKnownSoftware from '#/hooks/app/useKnownSoftware';

type Props = {
	software: string;
	iconSizeMultiplier?: number;
	height?: number;
	style?: StyleProp<ViewStyle>;
};

function SoftwareHeader({ software, height = 64, style }: Props) {
	const Theming = useKnownSoftware(software);

	const logo = Theming.logo;
	if (logo === undefined) return <View />;

	const WIDTH = (logo.width! / logo.height!) * height;
	return (
		<View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
			<Image
				source={{ uri: logo.localUri! }}
				style={{
					width: WIDTH,
					height: height,
				}}
			/>
		</View>
	);
}

export default SoftwareHeader;
