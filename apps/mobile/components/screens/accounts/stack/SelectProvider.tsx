import {View, Text} from "react-native";
import {StandardView} from "../../../../styles/Containers";
import MastodonIcon from "../../../../assets/svg/Logo_Mastodon";
import {Image} from "expo-image";
import {Button} from "@rneui/themed";
import {
  APP_FONT,
  APP_THEME,
  APP_THIRD_PARTY_BRANDING
} from "../../../../styles/AppTheme";
import TitleOnlyStackHeaderContainer
  from "../../../containers/TitleOnlyStackHeaderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";

function SelectProviderStack() {
  const route = useRoute()
  const navigation = useNavigation<any>();

  return (
      <TitleOnlyStackHeaderContainer
          route={route} navigation={navigation}
          headerTitle={`Select Platform`}
      >
        <View style={{flex: 1, backgroundColor: APP_THEME.BACKGROUND, height: "100%"}}>
          <StandardView>
            <View style={{
              width: "100%",
              backgroundColor: APP_THIRD_PARTY_BRANDING.MASTODON_DARK_BG,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 8,
              marginVertical: 32
            }}>
              <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
              >
                <MastodonIcon/>
                <Text style={{
                  fontSize: 28,
                  marginLeft: 8,
                  fontWeight: "400",
                  color: APP_FONT.MONTSERRAT_HEADER,
                  fontFamily: "Montserrat-Bold"
                }}>
                  Mastodon
                </Text>
              </View>
              <Text
                  style={{
                    fontSize: 16,
                    marginTop: 8,
                    marginBottom: 8,
                    textAlign: "center",
                    color: APP_FONT.MONTSERRAT_BODY
                  }}
              >
                Social networking that's not for sale.
              </Text>
              <View style={{marginTop: 16}}>
                <Button
                    onPress={() => {
                      navigation.navigate("Select Mastodon Server", {
                        type: "mastodon",
                      });
                    }}
                    color={"rgb(99, 100, 255)"}
                    size={"lg"}
                >
                  <Text style={{
                    color: APP_FONT.MONTSERRAT_HEADER,
                    fontSize: 16,
                    fontFamily: "Inter-Bold"
                  }}>Login</Text>
                </Button>
              </View>
            </View>

            <View style={{
              width: "100%",
              backgroundColor: APP_THIRD_PARTY_BRANDING.MISSKEY_DARK_BG,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 8
            }}>
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
                      style={{width: 200, height: 64}}
                      source={require("../../../../assets/icons/misskey_icon.png")}
                      contentFit="contain"
                      transition={1000}
                  />
                </View>
              </View>
              <Text style={{
                fontSize: 16,
                textAlign: "center",
                color: APP_FONT.MONTSERRAT_BODY
              }}>
                🌎 An Interplanetary microblogging platform 🚀
              </Text>
              <View style={{paddingTop: 16}}>
                <Button
                    color={
                      "linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))"
                    }
                    onPress={() => {
                      navigation.navigate("Select Misskey Server", {
                        type: "misskey",
                      });
                    }}
                    size={"lg"}
                >
                  <Text style={{
                    color: APP_FONT.MONTSERRAT_HEADER,
                    fontSize: 16,
                    fontFamily: "Inter-Bold"
                  }}>Login</Text>
                </Button>
              </View>
            </View>
          </StandardView>
        </View>
      </TitleOnlyStackHeaderContainer>
  );
}

export default SelectProviderStack;
