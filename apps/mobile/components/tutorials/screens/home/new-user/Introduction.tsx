import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import TimelinesHeader from "../../../../TimelineHeader";
import React, {useState} from "react";
import {Button, Dialog, Text} from "@rneui/themed"
import {APP_FONT, APP_THEME} from "../../../../../styles/AppTheme";
import {useNavigation} from "@react-navigation/native";

function Introduction() {
  const [DialogVisible, setDialogVisible] = useState(false)
  const navigation = useNavigation<any>()

  function takeUserToAccountsPage() {
    navigation.navigate("Accounts");
  }

  return <SafeAreaView
      style={{height: "100%", flex: 1, backgroundColor: "#121212"}}>
    <StatusBar backgroundColor="#222222"/>
    <Animated.View style={styles.header}>
      <TimelinesHeader
          SHOWN_SECTION_HEIGHT={50}
          HIDDEN_SECTION_HEIGHT={50}
      />
    </Animated.View>
    <Dialog isVisible={DialogVisible} onBackdropPress={() => {
      setDialogVisible(false)
    }}
            overlayStyle={{backgroundColor: "#1E1E1E", borderRadius: 8}}
            backdropStyle={{
              opacity: 0.87,
              backgroundColor: APP_THEME.BACKGROUND
            }}

    >
      <Dialog.Title titleStyle={{color: APP_THEME.LINK}}>
        Social Networking Definition
      </Dialog.Title>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_FONT.MONTSERRAT_BODY,
        marginBottom: 4
      }}>
        A <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_THEME.LINK,
        marginBottom: 16,
      }}>social networking client</Text> focuses on creating and
        maintaining
        relationships.
      </Text>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_FONT.MONTSERRAT_BODY,
        marginBottom: 24
      }}>e.g.- Facebook, MySpace</Text>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_FONT.MONTSERRAT_BODY,
        marginBottom: 4
      }}>
        A <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_THEME.LINK,
      }}>social media client</Text>, in comparison,
        is centered around the sharing and consumption of content (photos,
        videos, and articles).
      </Text>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_FONT.MONTSERRAT_BODY,
        marginBottom: 24
      }}>e.g. - Instagram, Twitter, Youtube</Text>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_FONT.MONTSERRAT_BODY,
        marginBottom: 24
      }}>
        Both do similar thing. But, the emphasis differs.
      </Text>
      <Text style={{
        fontFamily: "Inter-Bold",
        color: APP_THEME.LINK,
      }}>
        I built this app to make it easier for people
        (myself mostly, xD) to follow/interact
        with their favourite communities
        and make friends on the fediverse. ☺️
      </Text>
    </Dialog>
    <View style={{height: "100%", paddingTop: 54, flexGrow: 1}}>
      <View style={{
        padding: 10,
        display: "flex",
        alignItems: "center",
        height: "100%"
      }}>
        <View style={{flexGrow: 1, maxWidth: 256, marginTop: 32}}>
          <Text style={{
            fontSize: 20,
            fontFamily: "Montserrat-Bold",
            textAlign: "center"
          }}>Welcome,
            Friend !</Text>
          <Text style={{
            fontFamily: "Montserrat-Bold",
            color: APP_FONT.MONTSERRAT_HEADER,
            marginTop: 16,
            textAlign: "center"
          }}>
            Dhaaga is a <Text style={{
            color: APP_THEME.LINK,
            fontFamily: "Montserrat-Bold",
            opacity: 0.6
          }}
                              onPress={() => {
                                setDialogVisible(true)
                              }}
          >Social Networking client</Text>, offering a modern UI,
            Innovative features, and comes packed with
            privacy and digital well-being tools.
          </Text>
          <Text style={{
            fontFamily: "Montserrat-Bold",
            color: APP_FONT.MONTSERRAT_HEADER,
            marginTop: 16,
            textAlign: "center"
          }}>
            Currently available for Mastodon and being developed for Misskey
            eventually.
          </Text>
          <Text style={{
            fontFamily: "Montserrat-Bold",
            color: APP_FONT.MONTSERRAT_HEADER,
            marginTop: 16,
            textAlign: "center"
          }}>
            To use this app, you will need a Mastodon account.
          </Text>
          <View style={{marginTop: 32}}>
            <Button
                buttonStyle={{
                  marginBottom: 8
                }}
                color={APP_THEME.INVALID_ITEM}
                titleStyle={{
                  color: APP_THEME.INVALID_ITEM,
                  fontFamily: "Inter-Bold",
                  opacity: 0.87,
                  width: 256
                }}
                type={"clear"}
                onPress={() => {
                  navigation.navigate("What is Fediverse")
                }}
            >I am new to Mastodon</Button>
            <Button
                type={"clear"}
                color={APP_THEME.INVALID_ITEM}
                buttonStyle={{
                  marginBottom: 24
                }}
                titleStyle={{
                  color: APP_THEME.INVALID_ITEM,
                  fontFamily: "Inter-Bold",
                  opacity: 0.87,
                  width: 256
                }}
                onPress={() => {
                  navigation.navigate("New To Dhaaga")
                }}
            >I am new to
              this app</Button>
            <Button
                type={"solid"} color={APP_THEME.INVALID_ITEM}
                style={{marginBottom: 16}} size={"lg"}
                onPress={takeUserToAccountsPage}
            >
              <Text style={{
                fontFamily: "Inter-Bold",
                color: APP_FONT.MONTSERRAT_HEADER
              }}>
                Just take me to
                Login
              </Text>
            </Button>
          </View>

        </View>
        <View style={{flexShrink: 1}}>
          <Text style={{
            color: APP_FONT.MONTSERRAT_BODY,
            fontSize: 12,
            fontFamily: "Inter-Bold",
            opacity: 0.87
          }}>{"Built with" +
              " 💛 by Debashish Patra"}</Text>
        </View>
      </View>

    </View>
  </SafeAreaView>
}

export default Introduction


const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
