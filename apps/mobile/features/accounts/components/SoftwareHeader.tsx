import { View, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import useKnownSoftware from '#/hooks/app/useKnownSoftware';
import { NativeTextBold } from '#/ui/NativeText';

type Props = {
	software: string;
	iconSizeMultiplier?: number;
	height?: number;
	style?: StyleProp<ViewStyle>;
	addText?: boolean;
};

function SoftwareHeader({ software, height = 64, style, addText }: Props) {
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
			{addText ? (
				<View style={{ marginLeft: 8 }}>
					<NativeTextBold style={{ fontSize: 20 }}>
						{software.charAt(0).toUpperCase() + software.slice(1)}
					</NativeTextBold>
				</View>
			) : (
				<View />
			)}
		</View>
	);
}

export default SoftwareHeader;
