import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import MfmService from "../../../services/mfm.service";
import {randomUUID} from "expo-crypto";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {
  ActivityPubUserAdapter
} from "@dhaaga/shared-abstraction-activitypub/src";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type ConversationItem = {
  displayName: string
  accountUrl: string
  unread?: boolean
  lastStatusAt?: Date
}

/**
 * A StatusItem, with the content only
 * @constructor
 */
function ConversationItem({accountUrl, displayName, unread}: ConversationItem) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const subdomain = accountState?.activeAccount?.subdomain

  const [DescriptionContent, setDescriptionContent] = useState(<></>)
  const [UserInterface, setUserInterface] = useState(ActivityPubUserAdapter(null, domain))

  const {status, statusRaw, sharedStatus} = useActivitypubStatusContext()

  let content = status.getContent();
  useEffect(() => {
    const emojiMap = UserInterface.getEmojiMap()
    const {openAiContext, reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain,
      subdomain,
    })
    setDescriptionContent(<>
      {reactNodes?.map(
          (para, i) => {
            const uuid = randomUUID()
            return <Text key={uuid} style={{marginBottom: 8, opacity: 0.87}}>
              {para.map((o, j) => o)}
            </Text>
          }
      )}
    </>)
  }, [content]);

  return <View style={{
    display: "flex", flexDirection: "row",
    justifyContent: "space-between"
  }}>
    <View style={{flexGrow: 1}}>
      <View style={{display: "flex", flexDirection: "row"}}>
        <Text style={{
          color: "#fff",
          fontWeight: 700,
          opacity: 0.87
        }}>{displayName}</Text>
        <Text style={{
          color: "#fff",
          fontWeight: 700,
          opacity: 0.6
        }}>
          {accountUrl}
        </Text>
      </View>
      <View style={{
        marginBottom: 16,
        opacity: 0.6,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <FontAwesome5 name="check" size={12} color="#fff" style={{
          display: "inline"
        }}/>
        {DescriptionContent}
      </View>
    </View>

    <View>
      <Text style={{
        color: "#fff",
        opacity: 0.6
      }}>
        12 hours ago</Text>
    </View>
  </View>
}

export default ConversationItem;