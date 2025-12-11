import { Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppTheme } from '#/states/global/hooks';

function SocialHubThemePicker() {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				marginHorizontal: 8,
			}}
		>
			<Text
				style={{
					color: theme.textColor.medium,
					fontSize: 18,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					marginTop: 16,
					marginBottom: 12,
				}}
			>
				How are you feeling ?
			</Text>

			<View style={{ flexDirection: 'column' }}>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							backgroundColor: '#333',
							padding: 8,
							borderRadius: 8,
							paddingHorizontal: 12,
							flex: 1,
							marginRight: 4,
						}}
					>
						<Text
							style={{
								color: theme.textColor.medium,
								marginBottom: 4,
								fontSize: 18,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Classic
						</Text>
					</View>
					<View
						style={{
							backgroundColor: '#333',
							padding: 8,
							borderRadius: 8,
							paddingHorizontal: 12,
							flex: 1,
							marginLeft: 4,
						}}
					>
						<Text
							style={{
								color: theme.textColor.medium,
								marginBottom: 4,
								fontSize: 18,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Sakura 🌸
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

export default SocialHubThemePicker;
