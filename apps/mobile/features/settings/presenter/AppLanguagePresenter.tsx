import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { LocaleOptions } from '../../../i18n/data';
import { FlatList, Pressable, View } from 'react-native';
import useAppSettings from '../interactors/useAppSettings';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppDivider } from '../../../components/lib/Divider';
import { APP_SETTING_KEY } from '../../../services/settings.service';
import { AppIcon } from '../../../components/lib/Icon';
import { useTranslation } from 'react-i18next';

function AppLanguagePresenter() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { getValue, setValue, setAppLangauge } = useAppSettings();
	const { theme } = useAppTheme();
	const { i18n, t } = useTranslation();

	function onChangeLanguage(languageCode: string) {
		i18n.changeLanguage(languageCode);
		setAppLangauge(languageCode);
	}

	const lang = getValue(APP_SETTING_KEY.APP_LANGUAGE);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'App Language'}
			translateY={translateY}
		>
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
											item.code === lang
												? theme.primary.a0
												: theme.complementary.a0,
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
										color={theme.primary.a0}
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
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 8,
					paddingHorizontal: 10,
				}}
			/>
		</AppTopNavbar>
	);
}

export default AppLanguagePresenter;
