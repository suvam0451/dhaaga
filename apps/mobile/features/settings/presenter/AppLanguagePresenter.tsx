import { LocaleOptions } from '#/i18n/data';
import { FlatList, Pressable, View } from 'react-native';
import useAppSettings from '#/hooks/app/useAppSettings';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { AppDivider } from '#/components/lib/Divider';
import { APP_SETTING_KEY } from '#/services/settings.service';
import { AppIcon } from '#/components/lib/Icon';
import { useTranslation } from 'react-i18next';
import SettingPageBuilder from '#/ui/SettingPageBuilder';

function AppLanguagePresenter() {
	const { getValue, setAppLanguage } = useAppSettings();
	const { theme } = useAppTheme();
	const { i18n } = useTranslation();

	function onChangeLanguage(languageCode: string) {
		i18n.changeLanguage(languageCode);
		setAppLanguage(languageCode);
	}

	const lang = getValue(APP_SETTING_KEY.APP_LANGUAGE);

	return (
		<SettingPageBuilder label={'App Language'}>
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
								<AppText.Medium
									style={{
										fontSize: 18,
										color:
											item.code === lang ? theme.primary : theme.complementary,
										marginBottom: 2,
									}}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								>
									{item.nativeLabel}
								</AppText.Medium>
								<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
									{item.enLabel}
								</AppText.Normal>
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
						<AppDivider.Hard
							style={{
								marginVertical: 12,
								backgroundColor: theme.background.a50,
							}}
						/>
					</View>
				)}
				contentContainerStyle={{
					paddingTop: 8,
					paddingHorizontal: 10,
					paddingBottom: 52,
				}}
			/>
		</SettingPageBuilder>
	);
}

export default AppLanguagePresenter;
