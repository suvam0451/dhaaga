import { StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import useKnownSoftware from '../../../hooks/app/useKnownSoftware';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	software: string;
	mt?: number;
	mb?: number;
	iconSizeMultiplier?: number;
	addText?: boolean;
	height?: number;
};

function SoftwareHeader({ software, addText, height = 64 }: Props) {
	const { theme } = useAppTheme();
	const Theming = useKnownSoftware(software);

	const WIDTH = (Theming?.logo?.width / Theming?.logo?.height) * height;
	return (
		<>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: Theming?.logo?.localUri }}
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
		</>
	);
}

const styles = StyleSheet.create({
	accountCategoryText: {
		fontSize: 16,
		marginLeft: 6,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	},
});

export default SoftwareHeader;
