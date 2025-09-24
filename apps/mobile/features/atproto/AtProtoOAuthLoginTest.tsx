import { useLocalSearchParams } from 'expo-router';
import TitleOnlyNoScrollContainer from '../../components/containers/TitleOnlyNoScrollContainer';
import { Dimensions, ScrollView, View } from 'react-native';
import WebView from 'react-native-webview';
import { useState } from 'react';
import { AppText } from '../../components/lib/Text';
import HideOnKeyboardVisibleContainer from '../../components/containers/HideOnKeyboardVisibleContainer';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../types/app.types';

function AtProtoOAuthLoginTest() {
	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const [CallbackUrl, setCallbackUrl] = useState(null);
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	// Mastodon/Pleroma need to use the callback code to work
	function callback(state) {
		setCallbackUrl(state.url);
		const regex = /^https:\/\/(.*?)\?code=(.*?)$/;
		if (regex.test(state.url)) {
			// const code = state.url.match(regex)[2];
			// setCode(code);
		}
	}

	return (
		<TitleOnlyNoScrollContainer
			headerTitle={t(`topNav.secondary.blueskySignIn`)}
		>
			<View style={{ height: '100%', display: 'flex' }}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<WebView
						style={{ flex: 1, minWidth: Dimensions.get('window').width - 20 }}
						source={{ uri: _signInUrl }}
						onNavigationStateChange={callback}
					/>
				</ScrollView>
				<View style={{ marginBottom: 36 }}>
					<HideOnKeyboardVisibleContainer style={{ marginVertical: 16 }}>
						<AppText.Medium style={{ color: theme.primary.a0, fontSize: 18 }}>
							Waiting for you to Sign-In
						</AppText.Medium>
					</HideOnKeyboardVisibleContainer>
				</View>
			</View>
		</TitleOnlyNoScrollContainer>
	);
}

export default AtProtoOAuthLoginTest;
