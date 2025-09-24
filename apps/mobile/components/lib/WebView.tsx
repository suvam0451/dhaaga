import { Dimensions, ScrollView } from 'react-native';
import WebView, { type WebViewNavigation } from 'react-native-webview';

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
	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<WebView
				style={{
					flex: 1,
					minWidth: Dimensions.get('window').width - 20,
					opacity: isBlurred ? 0.1 : 1,
				}}
				source={{ uri }}
				onNavigationStateChange={onNavigationStateChange}
			/>
		</ScrollView>
	);
}

export { AppAuthWebView };
