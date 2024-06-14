import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import {
  ScrollView,
  View,
  StyleSheet,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView, Platform
} from "react-native";
import {useQuery} from "@realm/react";
import {ActivityPubServer} from "../../entities/activitypub-server.entity";
import {useEffect, useMemo, useReducer, useState} from "react";
import {Input, Text} from "@rneui/themed"
import {
  ActivityPubCustomEmojiItem
} from "../../entities/activitypub-emoji.entity";
import {Image} from "expo-image";
import {APP_FONT} from "../../styles/AppTheme";

type Props = {
  onBackdropPressed: () => void
}

function CustomEmojiPicker({onBackdropPressed}: Props) {
  const [KeyboardVisible, setKeyboardVisible] = useState(false)

  const {primaryAcct} = useActivityPubRestClientContext()
  const subdomain = primaryAcct?.subdomain

  const server = useQuery(ActivityPubServer).find((o) => o.url === subdomain)
  const emojis = server?.emojis

  const {categories, mapper} = useMemo(() => {
    const set = new Set<string>()
    const mapper = new Map<string, ActivityPubCustomEmojiItem[]>()
    server.emojis.forEach((o) => {
      if (!set.has(o.category[0]?.name)) {
        set.add(o.category[0]?.name)
        mapper.set(o.category[0]?.name, [])
      }
      mapper.get(o.category[0]?.name).push(o)
    })
    return {categories: Array.from(set), mapper}
  }, [server])

  /**
   * Handle keyboard
   */
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true); // or some other action
        }
    );
    const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false); // or some other action
        }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return <Pressable
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        height: "100%",
        paddingHorizontal: 16,
        display: "flex"
      }}
      onPressOut={onBackdropPressed}
  >
    <TouchableWithoutFeedback>
      <View style={{
        backgroundColor: "#2c2c2c",
        borderRadius: 8,
        padding: 8,
        marginVertical: "auto",
        marginTop: KeyboardVisible ? 16 : "auto",
        marginHorizontal: "auto",
        display: "flex",
        flexGrow: 0,
        zIndex: 99
      }}>
        {!KeyboardVisible && <View style={{marginBottom: 16, marginTop: 4}}>
            <Text style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 20,
              color: APP_FONT.MONTSERRAT_HEADER
            }}>Custom Emojis</Text>
            <Text>mastodon.social</Text>
        </View>}
        <ScrollView style={{
          maxHeight: KeyboardVisible ? 196 : 256,
          backgroundColor: "#1E1E1E",
          borderRadius: 8,
          padding: 4,
          flexGrow: KeyboardVisible ? 1 : 0,
          // flex: 1
        }}>
          {categories.map((o, i) => <View
              style={styles.emojiCategoryContainer}>
            <Text key={i} style={{
              fontFamily: "Montserrat-Bold",
              color: APP_FONT.MONTSERRAT_HEADER,
              marginBottom: 8
            }}>{o}</Text>
            <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}>
              {mapper.has(o) ? mapper.get(o).map((k, kkey) => <View key={kkey}
                                                                    style={styles.emojiContainer}>
                <Image source={k.url}
                       style={{width: 32, height: 32, borderRadius: 8}}/>
                {/*<Text>{k.shortcode}</Text>*/}
              </View>) : <View></View>}
            </View>
          </View>)}
        </ScrollView>
        <View style={{marginTop: 16, flexShrink: 1}}>
          <Input placeholder={"Search"}/>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Pressable>
}

const styles = StyleSheet.create({
  emojiContainer: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 8
  },
  emojiCategoryContainer: {
    marginBottom: 16
  }
})

export default CustomEmojiPicker;