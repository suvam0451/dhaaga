import { AppText } from '#/components/lib/Text';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple label={t(`topNav.secondary.manageSubscriptions`)} />
			<View
				style={{
					flex: 1,
					paddingTop: 100,
					backgroundColor: theme.background.a0,
				}}
			>
				<AppText.Medium style={{ textAlign: 'center' }}>
					{t(`unspecced.wipText`)}
				</AppText.Medium>
			</View>
		</>
	);
}

export default Page;
