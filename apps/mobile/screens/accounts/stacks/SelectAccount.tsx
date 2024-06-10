import {
  View,
  ScrollView,
} from "react-native";
import {StandardView} from "../../../styles/Containers";
import {Button, Divider} from "@rneui/base";
import AccountListingFragment from "../fragments/AccountListingFragment";
import MastodonIcon from "../../../assets/svg/Logo_Mastodon_Smaller";
// import MisskeyIcon from "../../../assets/icons/MisskeyIcon.png";

import {useWindowDimensions} from "react-native";
import {useQuery} from "@realm/react";
import {Account} from "../../../entities/account.entity";
import {Text} from "@rneui/themed"
import TitleOnlyStackHeaderContainer
  from "../../../components/containers/TitleOnlyStackHeaderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Image} from "expo-image";
import {Asset, useAssets} from 'expo-asset';
import {useEffect} from "react";


function NoAccountsToShow({service}: { service: string }) {
  return <View style={{
    borderWidth: 1, borderColor: "#888", padding: 8, borderRadius: 8,
    marginHorizontal: 8
  }}>
    <Text style={{textAlign: "center"}}>You have not added
      any {service} compatible account</Text>
  </View>
}

function SelectAccountStack() {
  const {height} = useWindowDimensions();
  const route = useRoute<any>()
  const navigation = useNavigation<any>();

  const accounts = useQuery(Account)

  const MastodonAccounts = accounts.filter((o) => o?.domain === "mastodon");
  const MisskeyAccounts = accounts.filter((o) => o?.domain === "misskey");
  const [assets, error] = useAssets([require('../../../assets/icons/misskeyicon.png')]);
  //
  if (error || !assets || !assets[0]?.downloaded) return <View></View>
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
            <StandardView style={{flexGrow: 1}}>
              <View style={{marginTop: 16}}>
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
                        marginLeft: 8,
                        fontFamily: "Montserrat-Bold"
                      }}
                  >
                    Mastodon
                  </Text>
                </View>
              </View>
              <Divider style={{marginVertical: 16}}/>
              {MastodonAccounts.length == 0 ?
                  <NoAccountsToShow
                      service={"Mastodon"}/> : MastodonAccounts.map((o, i) => (
                      <AccountListingFragment key={i} id={o._id}/>
                  ))}
              <View style={{
                marginTop: 32,
                marginBottom: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}>
                <View>
                  <Image source={assets[0].localUri}
                         style={{width: 36, height: 36}}/>
                </View>
                <Text style={{
                  fontSize: 20, fontWeight: "500",
                  fontFamily: "Montserrat-Bold",
                  marginLeft: 4
                }}>Misskey</Text>
              </View>
              <Divider style={{marginVertical: 16}}/>
              {MisskeyAccounts.length == 0 ?
                  <NoAccountsToShow
                      service={"Misskey"}/> : MisskeyAccounts.map((o, i) => (
                      <AccountListingFragment key={i} id={o._id}/>
                  ))}
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
