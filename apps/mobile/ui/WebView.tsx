import { Dimensions, ScrollView } from 'react-native';
import WebView, { type WebViewNavigation } from 'react-native-webview';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';

type AppAuthWebViewProps = {
	isBlurred: boolean;
	uri: string;
	onNavigationStateChange: (event: WebViewNavigation) => void;
};

function AppAuthWebView({
	uri,
	isBlurred,
	onNavigationStateChange,
}: AppAuthWebViewProps) {
	const { theme } = useAppTheme();
	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				backgroundColor: theme.background.a0,
				paddingTop: appDimensions.topNavbar.simpleVariantHeight,
			}}
		>
			<WebView
				style={{
					flex: 1,
					minWidth: Dimensions.get('window').width - 20,
					opacity: isBlurred ? 0.1 : 1,
					backgroundColor: theme.background.a0,
				}}
				source={{ uri }}
				onNavigationStateChange={onNavigationStateChange}
			/>
		</ScrollView>
	);
}

export { AppAuthWebView };
