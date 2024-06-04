import {
  View,
  Text,
  ScrollView,
} from "react-native";
import {StandardView} from "../../../styles/Containers";
import {Button, Divider} from "@rneui/base";
import AccountListingFragment from "../fragments/AccountListingFragment";
import MastodonIcon from "../../../assets/svg/Logo_Mastodon_Smaller";
import {useWindowDimensions} from "react-native";
import {useQuery} from "@realm/react";
import {Account} from "../../../entities/account.entity";
import TitleOnlyStackHeaderContainer
  from "../../../components/containers/TitleOnlyStackHeaderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";

function SelectAccountStack() {
  const {height} = useWindowDimensions();
  const route = useRoute<any>()
  const navigation = useNavigation<any>();

  const accounts = useQuery(Account)

  const MastodonAccounts = accounts.filter((o) => o?.domain === "mastodon");
  const MisskeyAccounts = accounts.filter((o) => o?.domain === "misskey");

  return (
      <TitleOnlyStackHeaderContainer
          route={route} navigation={navigation}
          headerTitle={`Select Account`}
      >
        <ScrollView
            contentContainerStyle={{
              minHeight: height - 105,
            }}
        >
          <View style={{flex: 1, display: "flex"}}>
            <Divider/>
            <StandardView style={{flexGrow: 1}}>
              <View style={{marginTop: 16, marginBottom: 16}}>
                <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 4,
                    }}
                >
                  <MastodonIcon/>
                  <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        marginBottom: 8,
                        marginLeft: 8,
                      }}
                  >
                    Mastodon
                  </Text>
                </View>
                {MastodonAccounts.map((o, i) => (
                    <AccountListingFragment key={i} id={o._id}/>
                ))}
              </View>
              <Divider/>
              <View style={{marginTop: 16, marginBottom: 16}}>
                <Text style={{fontSize: 20, fontWeight: "500"}}>Misskey</Text>
              </View>
              {MisskeyAccounts.map((o, i) => (
                  <AccountListingFragment key={i} id={o._id}/>
              ))}
              <Divider/>
            </StandardView>
            <StandardView style={{marginBottom: 32}}>
              <Button
                  onPress={() => {
                    navigation.navigate("Select a Platform", {type: "mastodon"});
                  }}
              >
                Add an Account
              </Button>
            </StandardView>
          </View>
        </ScrollView>
      </TitleOnlyStackHeaderContainer>
  );
}

export default SelectAccountStack;
