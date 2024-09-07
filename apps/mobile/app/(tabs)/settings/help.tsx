import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import * as Linking from 'expo-linking';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';

const SettingsStackHelp = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={'Help'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54 + 16, paddingHorizontal: 12 }}
			>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						marginBottom: 16,
					}}
				>
					Will add more stuff here soon.
				</Text>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					Mostly related to helpful links to the documentation website (yep, did
					you not know that we have a wiki ???).
				</Text>

				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							alignItems: 'center',
							padding: 10,
							backgroundColor: '#242424',
							borderRadius: 8,
							marginTop: 16,
							flexDirection: 'row',
						}}
						onPress={() => {
							Linking.openURL('https://discord.gg/kMp5JA9jwD');
						}}
					>
						<View>
							<Ionicons
								name="logo-discord"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<Text
							style={{
								textAlign: 'center',
								color: APP_FONT.MONTSERRAT_BODY,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								paddingRight: 4,
								marginLeft: 10,
							}}
						>
							Join on Discord
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							alignItems: 'center',
							padding: 10,
							backgroundColor: '#242424',
							borderRadius: 8,
							marginTop: 16,
							flexDirection: 'row',
						}}
						onPress={() => {
							Linking.openURL('https://dhaaga.app/docs');
						}}
					>
						<View style={{ width: 24 }}>
							<AntDesign
								name="book"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<Text
							style={{
								textAlign: 'center',
								color: APP_FONT.MONTSERRAT_BODY,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								paddingRight: 4,
								marginLeft: 10,
							}}
						>
							Open Wiki
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</AppTopNavbar>
	);
});

export default SettingsStackHelp;
