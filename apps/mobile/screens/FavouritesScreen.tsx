import { View, Text, Dimensions } from "react-native";
import WebView from "react-native-webview";

function FavouritesScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Favourites!</Text>
			<WebView
				style={{ flex: 1, minWidth: Dimensions.get("window").width - 20 }}
				source={{ uri: "google.com" }}
				// onNavigationStateChange={callback}
				androidHardwareAccelerationDisabled={true}
			/>
		</View>
	);
}

export default FavouritesScreen;
