import { Text } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function HashtagProcessor({
	content,
	forwardedKey,
}: {
	content: string;
	forwardedKey: string | number;
}) {
	const { showActionSheetWithOptions } = useActionSheet();
	const navigation = useNavigation<any>();

	const onPress = () => {
		const options = ["Browse", "Follow", "Cancel"];
		const destructiveButtonIndex = options.length - 1;
		const cancelButtonIndex = options.length - 1;

		showActionSheetWithOptions(
			{
				options,
				message: "You do not follow this hashtag.",
				cancelButtonIndex,
				destructiveButtonIndex,
				title: `#${content}`,
				userInterfaceStyle: "dark",
			},
			(selectedIndex: number) => {
				switch (selectedIndex) {
					case 0: {
						console.log("browe clicked");
						navigation.navigate("Browse Hashtag", {
							q: content,
							title: `#${content}`,
						});
						break;
					}

					case destructiveButtonIndex:
						// Delete
						break;

					case cancelButtonIndex:
					// Canceled
				}
			}
		);
	};

	return (
		<Text onPress={onPress} key={forwardedKey} style={{ color: "green" }}>
			#{content}
		</Text>
	);
}

export default HashtagProcessor;
