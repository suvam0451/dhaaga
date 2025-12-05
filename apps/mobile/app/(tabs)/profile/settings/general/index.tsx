import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import AppSettingBooleanToggle from '#/components/screens/settings/fragments/AppSettingBooleanToggle';
import { useState } from 'react';
import { AppDivider } from '#/components/lib/Divider';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';
import { APP_SETTING_KEY } from '#/services/settings.service';
import useAppSettings from '#/features/settings/interactors/useAppSettings';
import { LocaleOptions } from '#/i18n/data';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import SettingPageBuilder from '#/ui/SettingPageBuilder';

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
	const { theme } = useAppTheme();
	const { getValue } = useAppSettings();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SETTINGS]);

	function toggleCheck() {
		setIsChecked(!IsChecked);
	}

	const lang = getValue(APP_SETTING_KEY.APP_LANGUAGE);
	const selectedLocale = LocaleOptions.find((o) => o.code === lang);

	return (
		<SettingPageBuilder label={t(`general.navbar_Label`)}>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={'language'} size={28} color={theme.primary.a0} />
				<AppText.Medium
					style={{ fontSize: 18, color: theme.primary.a0, marginLeft: 6 }}
				>
					{t(`general.language.S_Language`)}
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
					{t(`general.language.L_appLanguage`)}
				</AppText.Medium>
				<View style={{ flex: 1 }} />
				<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
					{selectedLocale.nativeLabel}
				</AppText.Medium>
				<AppIcon id={'chevron-right'} size={28} />
			</Pressable>

			<View style={styles.settingItemContainer}>
				<AppText.Medium style={{ fontSize: 18, color: theme.secondary.a10 }}>
					{t(`general.language.L_contentLanguages`)}
				</AppText.Medium>
				<View style={{ flex: 1 }} />
				<AppIcon id={'chevron-right'} size={28} />
			</View>
			{/*<View style={styles.settingItemContainer}>*/}
			{/*	<AppText.Medium*/}
			{/*		emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
			{/*		style={{ fontSize: 18 }}*/}
			{/*	>*/}
			{/*		{t(`general.language.L_translatorMode`)}*/}
			{/*	</AppText.Medium>*/}
			{/*	<View style={{ flex: 1 }} />*/}
			{/*	<AppIcon id={'info'} color={theme.complementary.a0} size={28} />*/}
			{/*	<AppSettingBooleanToggle*/}
			{/*		isChecked={IsChecked}*/}
			{/*		onPress={toggleCheck}*/}
			{/*	/>*/}
			{/*</View>*/}

			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={'language'} size={28} color={theme.primary.a0} />
				<AppText.Medium
					style={{ fontSize: 18, color: theme.primary.a0, marginLeft: 6 }}
				>
					{t(`general.timelines.S_Timelines`)}
				</AppText.Medium>
			</View>
			<Divider />
			<View style={styles.settingItemContainer}>
				<View>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						{t(`general.timelines.L_lurkerMode`)}
					</AppText.Medium>
					<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						{t(`general.timelines.D_lurkerMode`)}
					</AppText.Normal>
				</View>

				<View style={{ flex: 1 }} />
				<AppSettingBooleanToggle isChecked={IsChecked} onPress={toggleCheck} />
			</View>

			<View style={styles.settingItemContainer}>
				<AppText.Medium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					{t(`general.timelines.L_contentWarnings`)}
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
				{t(`discover.moreSoon.firstHalf`, {
					ns: LOCALIZATION_NAMESPACE.CORE,
				})}{' '}
				<Text style={{ color: theme.complementary.a0 }}>
					{t(`discover.moreSoon.secondHalf`, {
						ns: LOCALIZATION_NAMESPACE.CORE,
					})}
				</Text>
			</Text>
		</SettingPageBuilder>
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
