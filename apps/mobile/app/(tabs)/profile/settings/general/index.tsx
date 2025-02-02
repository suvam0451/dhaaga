import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../../components/shared/topnavbar/AppTopNavbar';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../components/lib/Text';
import { appDimensions } from '../../../../../styles/dimensions';
import { AppIcon } from '../../../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';
import AppSettingBooleanToggle from '../../../../../components/screens/settings/fragments/AppSettingBooleanToggle';
import { useState } from 'react';
import { AppDivider } from '../../../../../components/lib/Divider';
import { APP_ROUTING_ENUM } from '../../../../../utils/route-list';
import { router } from 'expo-router';

function Divider() {
	const { theme } = useAppTheme();
	return (
		<AppDivider.Hard
			style={{
				flex: 1,
				backgroundColor: theme.background.a50,
				marginTop: 16,
			}}
		/>
	);
}

function Page() {
	const [IsChecked, setIsChecked] = useState(false);
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();

	function toggleCheck() {
		setIsChecked(!IsChecked);
	}

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'General Settings'}
			translateY={translateY}
		>
			<ScrollView
				style={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingHorizontal: 16,
				}}
			>
				<View
					style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
				>
					<AppIcon id={'language'} size={28} color={theme.primary.a0} />
					<AppText.Medium
						style={{ fontSize: 18, color: theme.primary.a0, marginLeft: 6 }}
					>
						Language
					</AppText.Medium>
				</View>
				<Divider />
				<Pressable
					style={styles.settingItemContainer}
					onPress={() => {
						router.navigate(APP_ROUTING_ENUM.SETTINGS_GENERAL_APP_LANGUAGE);
					}}
				>
					<AppText.Medium style={{ fontSize: 18, color: theme.secondary.a10 }}>
						App Language
					</AppText.Medium>
					<View style={{ flex: 1 }} />
					<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						English
					</AppText.Medium>
					<AppIcon
						id={'chevron-right'}
						size={28}
						onPress={() => {
							router.navigate(APP_ROUTING_ENUM.SETTINGS_GENERAL_APP_LANGUAGE);
						}}
					/>
				</Pressable>

				<View style={styles.settingItemContainer}>
					<AppText.Medium style={{ fontSize: 18, color: theme.secondary.a10 }}>
						Content Languages
					</AppText.Medium>
					<View style={{ flex: 1 }} />
					<AppIcon id={'chevron-right'} size={28} />
				</View>
				<View style={styles.settingItemContainer}>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						Translator Mode
					</AppText.Medium>
					<View style={{ flex: 1 }} />
					<AppIcon id={'info'} color={theme.complementary.a0} size={28} />
					<AppSettingBooleanToggle
						isChecked={IsChecked}
						onPress={toggleCheck}
					/>
				</View>

				<View
					style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
				>
					<AppIcon id={'language'} size={28} color={theme.primary.a0} />
					<AppText.Medium
						style={{ fontSize: 18, color: theme.primary.a0, marginLeft: 6 }}
					>
						Timelines
					</AppText.Medium>
				</View>
				<Divider />
				<View style={styles.settingItemContainer}>
					<View>
						<AppText.Medium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							style={{ fontSize: 18 }}
						>
							Lurker Mode
						</AppText.Medium>
						<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
							Hides interactive buttons
						</AppText.Normal>
					</View>

					<View style={{ flex: 1 }} />
					<AppIcon
						id={'flash'}
						containerStyle={{ marginLeft: 6 }}
						color={theme.complementary.a0}
					/>
					<AppSettingBooleanToggle
						isChecked={IsChecked}
						onPress={toggleCheck}
					/>
				</View>

				<View style={styles.settingItemContainer}>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						Content Warnings
					</AppText.Medium>
					<View style={{ flex: 1 }} />
					<AppIcon
						id={'flash'}
						containerStyle={{ marginLeft: 6 }}
						color={theme.complementary.a0}
					/>
					<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						Hide
					</AppText.Medium>
					<AppIcon id={'chevron-right'} size={28} />
				</View>

				<Text style={[styles.text, { color: theme.secondary.a20 }]}>
					More settings coming{' '}
					<Text style={{ color: theme.complementary.a0 }}>soon™</Text>
				</Text>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
	settingItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 28,
		marginVertical: 10,
	},
});
