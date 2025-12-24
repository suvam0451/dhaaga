import { LocaleOptions } from '#/i18n/data';
import { FlatList, Pressable, View } from 'react-native';
import useAppSettings from '#/hooks/app/useAppSettings';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { APP_SETTING_KEY } from '#/services/settings.service';
import { AppIcon } from '#/components/lib/Icon';
import { useTranslation } from 'react-i18next';
import SettingPageBuilder from '#/ui/SettingPageBuilder';
import { AppDividerHard } from '#/ui/Divider';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { router } from 'expo-router';

function AppLanguageView() {
	const { getValue, setAppLanguage } = useAppSettings();
	const { theme } = useAppTheme();
	const { i18n } = useTranslation();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onChangeLanguage(languageCode: string) {
		setAppLanguage(languageCode);
		i18n.changeLanguage(languageCode);
		router.back();
	}

	const lang = getValue(APP_SETTING_KEY.APP_LANGUAGE);

	return (
		<SettingPageBuilder label={t(`topNav.secondary.appLanguage`)}>
			<FlatList
				data={LocaleOptions}
				renderItem={({ item }) => (
					<View>
						<Pressable
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => {
								onChangeLanguage(item.code);
							}}
						>
							<View style={{ flex: 1 }}>
								<NativeTextBold
									style={{
										fontSize: 18,
										color:
											item.code === lang ? theme.primary : theme.complementary,
										marginBottom: 2,
									}}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								>
									{item.nativeLabel}
								</NativeTextBold>
								<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
									{item.enLabel}
								</NativeTextNormal>
							</View>
							<View>
								{item.code === lang && (
									<AppIcon
										id={'checkmark-circle'}
										size={32}
										color={theme.primary}
										containerStyle={{ paddingRight: 8 }}
									/>
								)}
							</View>
						</Pressable>
					</View>
				)}
				contentContainerStyle={{
					paddingTop: 8,
					paddingBottom: 52,
				}}
				ItemSeparatorComponent={() => (
					<AppDividerHard
						style={{
							marginVertical: 12,
							backgroundColor: theme.background.a50,
						}}
					/>
				)}
			/>
		</SettingPageBuilder>
	);
}

export default AppLanguageView;
