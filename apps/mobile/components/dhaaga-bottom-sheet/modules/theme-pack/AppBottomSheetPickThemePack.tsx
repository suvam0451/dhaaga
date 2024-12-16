import { memo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { APP_BUILT_IN_THEMES } from '../../../../styles/BuiltinThemes';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';

const AppBottomSheetPickThemePack = memo(() => {
	const { theme, isAnimating, hide, setTheme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			isAnimating: o.bottomSheet.isAnimating,
			hide: o.bottomSheet.hide,
			setTheme: o.setColorScheme,
		})),
	);

	if (isAnimating) return <View />;

	return (
		<View style={{ height: '100%' }}>
			<View style={{ marginTop: 16 }}>
				<Text
					style={{
						color: theme.textColor.high,
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
						setTheme(o.id);
						hide();
					}}
					style={{ margin: 10 }}
				>
					<Text
						style={{
							color: theme.textColor.high,
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
