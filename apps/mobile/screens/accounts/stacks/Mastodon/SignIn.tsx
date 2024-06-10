import {Dimensions, View, Keyboard, ScrollView} from "react-native";
import {Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import WebView from "react-native-webview";
import {StandardView} from "../../../../styles/Containers";
import {MainText} from "../../../../styles/Typography";
import {Button} from "@rneui/base";
import {
  MastodonService,
  RestClient,
  RestServices,
} from "@dhaaga/shared-provider-mastodon/src";
import {useNavigation, useRoute} from "@react-navigation/native";
import AccountRepository from "../../../../repositories/account.repo";
import {useRealm} from "@realm/react";
import TitleOnlyNoScrollContainer
  from "../../../../components/containers/TitleOnlyNoScrollContainer";

function MastodonSignInStack() {
  const [Code, setCode] = useState<string | null>(null);
  const route = useRoute<any>()
  const navigation = useNavigation<any>();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true); // or some other action
        }
    );
    const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false); // or some other action
        }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const signInUrl = route?.params?.signInUrl || "https://mastodon.social";
  const subdomain = route?.params?.subdomain;
  const db = useRealm()

  function callback(state) {
    const regex = /^https:\/\/(.*?)\/oauth\/authorize\/native\?code=(.*?)$/;
    if (regex.test(state.url)) {
      const code = state.url.match(regex)[2];
      setCode(code);
    }
  }

  async function onPressConfirm() {
    const instance = subdomain.replace(/^https?:\/\//, '')
    const token = await MastodonService.getAccessToken(
        instance,
        Code,
        process.env.EXPO_PUBLIC_MASTODON_CLIENT_ID,
        process.env.EXPO_PUBLIC_MASTODON_CLIENT_SECRET
    );

    const client = new RestClient(instance, {
      accessToken: token,
      domain: "mastodon"
    });

    const verified =
        await RestServices.v1.accounts.verifyCredentials(client);

    db.write(() => {
      const acct = AccountRepository.upsert(db, {
        subdomain: instance,
        domain: "mastodon",
        username: verified.username,
        avatarUrl: verified.avatar
      })

      AccountRepository.setSecret(db, acct, "display_name", verified["display_name"])
      AccountRepository.setSecret(db, acct, "avatar", verified["avatar_static"])
      AccountRepository.setSecret(db, acct, "url", verified["url"])
      AccountRepository.setSecret(db, acct, "access_token", token)
    })

    navigation.navigate("Select an Account");
  }

  return (
      <TitleOnlyNoScrollContainer
          headerTitle={`Mastodon Sign-In`}
      >
        <View style={{height: "100%", display: "flex"}}>
          <ScrollView
              contentContainerStyle={{flexGrow: 1}}>
            <WebView
                style={{flex: 1, minWidth: Dimensions.get("window").width - 20}}
                source={{uri: signInUrl}}
                onNavigationStateChange={callback}
            />
          </ScrollView>
          {!isKeyboardVisible && (
              <StandardView style={{height: 240}}>
                <MainText style={{marginBottom: 12, marginTop: 16}}>
                  Step 3: Confirm your account
                </MainText>
                {Code ? (
                    <View>
                      <Text style={{marginBottom: 12}}>
                        A valid token was detected. Proceed with adding the
                        account
                        shown above?
                      </Text>
                    </View>
                ) : (
                    <View></View>
                )}
                <Button
                    disabled={!Code} color={"rgb(99, 100, 255)"}
                    onPress={onPressConfirm}>
                  Proceed
                </Button>
              </StandardView>
          )}
        </View>
      </TitleOnlyNoScrollContainer>
  );
}

export default MastodonSignInStack;
