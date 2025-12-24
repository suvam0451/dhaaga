import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { AppText } from '#/components/lib/Text';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useState } from 'react';
import { AppDivider } from '#/components/lib/Divider';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';
import { APP_SETTING_KEY } from '#/services/settings.service';
import useAppSettings from '#/hooks/app/useAppSettings';
import { LocaleOptions } from '#/i18n/data';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import SettingPageBuilder from '#/ui/SettingPageBuilder';
import { NativeTextBold, NativeTextMedium } from '#/ui/NativeText';
import AppSettingBooleanToggle from '#/features/settings/components/AppSettingBooleanToggle';

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
				<AppIcon id={'language'} size={28} color={theme.primary} />
				<NativeTextMedium
					style={{ fontSize: 18, color: theme.primary, marginLeft: 6 }}
				>
					{t(`general.language.S_Language`)}
				</NativeTextMedium>
			</View>
			<Divider />
			<Pressable
				style={styles.settingItemContainer}
				onPress={() => {
					router.navigate(APP_ROUTING_ENUM.SET_APP_LANGUAGE);
				}}
			>
				<NativeTextMedium style={{ fontSize: 18, color: theme.secondary.a10 }}>
					{t(`general.language.L_appLanguage`)}
				</NativeTextMedium>
				<View style={{ flex: 1 }} />
				<NativeTextMedium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
					{selectedLocale.nativeLabel}
				</NativeTextMedium>
				<AppIcon id={'chevron-right'} size={28} />
			</Pressable>

			<View style={styles.settingItemContainer}>
				<NativeTextMedium style={{ fontSize: 18, color: theme.secondary.a10 }}>
					{t(`general.language.L_contentLanguages`)}
				</NativeTextMedium>
				<View style={{ flex: 1 }} />
				<AppIcon id={'chevron-right'} size={28} />
			</View>
			{/*<View style={styles.settingItemContainer}>*/}
			{/*	<NativeTextMedium*/}
			{/*		emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
			{/*		style={{ fontSize: 18 }}*/}
			{/*	>*/}
			{/*		{t(`general.language.L_translatorMode`)}*/}
			{/*	</NativeTextMedium>*/}
			{/*	<View style={{ flex: 1 }} />*/}
			{/*	<AppIcon id={'info'} color={theme.complementary} size={28} />*/}
			{/*	<AppSettingBooleanToggle*/}
			{/*		isChecked={IsChecked}*/}
			{/*		onPress={toggleCheck}*/}
			{/*	/>*/}
			{/*</View>*/}

			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={'language'} size={28} color={theme.primary} />
				<NativeTextMedium
					style={{ fontSize: 18, color: theme.primary, marginLeft: 6 }}
				>
					{t(`general.timelines.S_Timelines`)}
				</NativeTextMedium>
			</View>
			<Divider />
			<View style={styles.settingItemContainer}>
				<View>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						{t(`general.timelines.L_lurkerMode`)}
					</NativeTextMedium>
					<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						{t(`general.timelines.D_lurkerMode`)}
					</AppText.Normal>
				</View>

				<View style={{ flex: 1 }} />
				<AppSettingBooleanToggle isChecked={IsChecked} onPress={toggleCheck} />
			</View>

			<View style={styles.settingItemContainer}>
				<NativeTextMedium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					{t(`general.timelines.L_contentWarnings`)}
				</NativeTextMedium>
				<View style={{ flex: 1 }} />
				<AppIcon
					id={'flash'}
					containerStyle={{ marginLeft: 6 }}
					color={theme.complementary}
				/>
				<NativeTextMedium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
					Hide
				</NativeTextMedium>
				<AppIcon id={'chevron-right'} size={28} />
			</View>

			<NativeTextBold style={[styles.text, { color: theme.secondary.a20 }]}>
				{t(`discover.moreSoon.firstHalf`, {
					ns: LOCALIZATION_NAMESPACE.CORE,
				})}
				<Text style={{ color: theme.complementary }}>
					{t(`discover.moreSoon.secondHalf`, {
						ns: LOCALIZATION_NAMESPACE.CORE,
					})}
				</Text>
			</NativeTextBold>
		</SettingPageBuilder>
	);
}

export default Page;

const styles = StyleSheet.create({
	text: {
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
