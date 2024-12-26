import { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import useKnownSoftware from '../../../hooks/app/useKnownSoftware';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type Props = {
	software: string;
	mt?: number;
	mb?: number;
	iconSizeMultiplier?: number;
	addText?: boolean;
};

const ICON_SIZE_MULTIPLIER = 1.2;

const SoftwareHeader = memo(function Foo({
	software,
	mt,
	mb,
	iconSizeMultiplier,
	addText,
}: Props) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const Theming = useKnownSoftware(software);
	const _mt = mt === undefined ? 8 : mt;
	const _mb = mb === undefined ? 12 : mb;

	const iconSize = iconSizeMultiplier || ICON_SIZE_MULTIPLIER;

	return (
		<View style={{ marginTop: _mt, marginBottom: _mb, marginLeft: 4 }}>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: 4,
					alignItems: 'center',
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: Theming?.logo?.localUri }}
					style={{
						width: Theming?.width * iconSize,
						height: Theming?.height * iconSize,
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
		</View>
	);
});

const styles = StyleSheet.create({
	accountCategoryText: {
		fontSize: 16,
		marginLeft: 6,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

export default SoftwareHeader;
