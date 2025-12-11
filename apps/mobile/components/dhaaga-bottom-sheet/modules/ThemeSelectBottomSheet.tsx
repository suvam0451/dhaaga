import { TouchableOpacity, View, Text } from 'react-native';
import { APP_BUILT_IN_THEMES } from '#/styles/BuiltinThemes';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';

function ThemeSelectBottomSheet() {
	const { theme, setTheme } = useAppTheme();
	const { hide } = useAppBottomSheet();

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
}

export default ThemeSelectBottomSheet;
