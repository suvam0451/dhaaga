import { View, Text } from "react-native";
import { StandardView } from "../../../styles/Containers";
import MastadonIcon from "../../../assets/svg/Logo_Mastodon";
import { Image } from "expo-image";
import { Card, Button } from "@rneui/base";

function SelectProviderStack({ navigation }) {
	return (
		<View style={{ flex: 1 }}>
			<StandardView>
				<View style={{ width: "100%" }}>
					<Card
						containerStyle={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<MastadonIcon />
							<Text style={{ fontSize: 28, marginLeft: 8, fontWeight: "400" }}>
								Mastodon
							</Text>
						</View>
						<Text
							style={{
								fontSize: 16,
								marginTop: 8,
								marginBottom: 8,
								textAlign: "center",
							}}
						>
							Social networking that's not for sale.
						</Text>
						<View style={{ paddingTop: 8 }}>
							<Button
								onPress={() => {
									navigation.navigate("Add Mastodon Account", {
										type: "mastodon",
									});
								}}
								color={"rgb(99, 100, 255)"}
								title={"Login"}
							/>
						</View>
					</Card>

					<Card
						containerStyle={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								margin: "auto",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<View
								style={{
									width: 200,
									height: 64,
								}}
							>
								<Image
									style={{ width: 200, height: 64 }}
									source={require("../../../assets/icons/Misskey_icon.png")}
									// placeholder={blurhash}
									contentFit="contain"
									transition={1000}
								/>
							</View>
						</View>
						<Text style={{ fontSize: 16, textAlign: "center" }}>
							🌎 An Interplanetary microblogging platform 🚀
						</Text>
						<View style={{ paddingTop: 16 }}>
							<Button
								color={
									"linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))"
								}
								title={"Login"}
							/>
						</View>
					</Card>
				</View>
			</StandardView>
		</View>
	);
}

export default SelectProviderStack;
