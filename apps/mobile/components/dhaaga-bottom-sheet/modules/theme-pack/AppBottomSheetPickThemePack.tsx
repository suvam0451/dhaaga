import { memo } from 'react';
import { useAppBottomSheet } from '../_api/useAppBottomSheet';
import { TouchableOpacity, View, Text } from 'react-native';
import { APP_BUILT_IN_THEMES } from '../../../../styles/BuiltinThemes';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

const AppBottomSheetPickThemePack = memo(() => {
	const { isAnimating, setVisible } = useAppBottomSheet();
	const { colorScheme, setPack } = useAppTheme();

	if (isAnimating) return <View />;

	return (
		<View style={{ height: '100%' }}>
			<View style={{ marginTop: 16 }}>
				<Text
					style={{
						color: colorScheme.textColor.high,
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					How are you feeling today?
				</Text>
			</View>
			{APP_BUILT_IN_THEMES.map((o) => (
				<TouchableOpacity
					onPress={() => {
						setPack(o.id);
						setVisible(false);
					}}
					style={{ margin: 10 }}
				>
					<Text
						style={{
							color: APP_FONT.HIGH_EMPHASIS,
							fontFamily: APP_FONTS.INTER_400_REGULAR,
						}}
					>
						{o.name}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
});

export default AppBottomSheetPickThemePack;
