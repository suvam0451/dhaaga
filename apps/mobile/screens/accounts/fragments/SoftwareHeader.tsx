import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '#/styles/AppFonts';
import useKnownSoftware from '#/hooks/app/useKnownSoftware';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

type Props = {
	software: string;
	mt?: number;
	mb?: number;
	iconSizeMultiplier?: number;
	addText?: boolean;
	height?: number;
	style?: StyleProp<ViewStyle>;
};

function SoftwareHeader({ software, addText, height = 64, style }: Props) {
	const { theme } = useAppTheme();
	const Theming = useKnownSoftware(software);

	const logo = Theming.logo;
	if (logo === undefined) return <View />;

	const WIDTH = (logo.width! / logo.height!) * height;
	return (
		<View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: logo.localUri! }}
				style={{
					width: WIDTH,
					height: height,
				}}
			/>
			{addText && (
				<Text
					style={[
						styles.accountCategoryText,
						{ color: theme.textColor.medium },
					]}
				>
					{Theming?.label}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	accountCategoryText: {
		fontSize: 16,
		marginLeft: 10,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	},
});

export default SoftwareHeader;
