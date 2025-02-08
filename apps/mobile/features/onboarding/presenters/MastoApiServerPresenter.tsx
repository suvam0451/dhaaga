import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import ServerInputView from '../views/ServerInputView';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import PopularMastoServersView from '../views/PopularMastoServersView';
import useMastoApiLogin from '../interactors/useMastoApiLogin';
import { appDimensions } from '../../../styles/dimensions';

function AccountsScreen() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { isLoading, server, setServer, resolve } = useMastoApiLogin();
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.selectServer`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{
						display: 'flex',
						paddingHorizontal: 12,
						marginBottom: 54,
						marginTop: 16,
					}}
				>
					<ServerInputView
						ServerText={server}
						setServerText={setServer}
						buttonColor={'rgb(99, 100, 255)'}
						onPressLogin={resolve}
						isLoading={isLoading}
					/>
					<PopularMastoServersView onSelect={setServer} />
				</KeyboardAvoidingView>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default AccountsScreen;
