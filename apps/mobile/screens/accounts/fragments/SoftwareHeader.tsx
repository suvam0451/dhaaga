import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import useKnownSoftware from '../../../hooks/app/useKnownSoftware';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

type Props = {
	software: string;
	mt?: number;
	mb?: number;
};

const ICON_SIZE_MULTIPLIER = 1.2;

const SoftwareHeader = memo(function Foo({ software, mt, mb }: Props) {
	const { colorScheme } = useAppTheme();
	const Theming = useKnownSoftware(software);
	const _mt = mt === undefined ? 8 : mt;
	const _mb = mb === undefined ? 12 : mb;

	return (
		<View style={{ marginTop: _mt, marginBottom: _mb, marginLeft: 4 }}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginBottom: 4,
					alignItems: 'center',
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: Theming?.logo?.localUri }}
					style={{
						width: Theming?.width * ICON_SIZE_MULTIPLIER,
						height: Theming?.height * ICON_SIZE_MULTIPLIER,
						opacity: 0.8,
					}}
				/>
				<Text
					style={[
						styles.accountCategoryText,
						{ color: colorScheme.textColor.medium },
					]}
				>
					{Theming?.label}
				</Text>
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
