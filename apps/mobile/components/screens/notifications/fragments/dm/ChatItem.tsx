import {useActivitypubStatusContext} from "../../../../../states/useStatus";
import {Text, View} from "react-native";
import {
  useActivityPubRestClientContext
} from "../../../../../states/useActivityPubRestClient";
import React, {useEffect, useState} from "react";
import MfmService from "../../../../../services/mfm.service";
import {randomUUID} from "expo-crypto";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../libs/redux/store";
import {AccountState} from "../../../../../libs/redux/slices/account";
import {Image} from "expo-image";
import {format} from "date-fns";

function ChatItem() {
  const {status, statusRaw} = useActivitypubStatusContext()
  const {me} = useActivityPubRestClientContext()
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const [DescriptionContent, setDescriptionContent] = useState(<></>)

  let content = status.getContent();
  useEffect(() => {
    const emojiMap = new Map()
    const {openAiContext, reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain: accountState?.activeAccount?.domain,
      subdomain: accountState?.activeAccount?.subdomain,
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

  const ownerIsMe = me?.getId() === status.getAccountId_Poster()

  const day = format(new Date(status.getCreatedAt()), "MM/dd")

  const time = format(new Date(status.getCreatedAt()), "h:mm a")

  return <View>
    <View style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: ownerIsMe ? "flex-end" : "flex-start",
      alignItems: ownerIsMe ? "center" : "flex-start"
    }}>
      {!ownerIsMe && <View style={{
        width: 32, height: 32,
        borderRadius: 16,
      }}>
          <Image style={{
            width: 32, height: 32,
            borderRadius: 12
          }} source={status.getAvatarUrl()}/>
      </View>}
      <View>
        {ownerIsMe && <Text style={{
          color: "#fff",
          marginBottom: 0,
          fontSize: 12,
          opacity: 0.6,
          textAlign: "right"
        }}>
          {day}
        </Text>}
        {ownerIsMe && <Text style={{
          color: "#fff",
          marginBottom: 8,
          fontSize: 10,
          opacity: 0.6
        }}>{time}</Text>}
      </View>
      <View style={{
        display: "flex",
        justifyContent: ownerIsMe ? "flex-end" : "flex-start",
        maxWidth: "80%",
        marginLeft: 4
      }}>
        {!ownerIsMe && <Text style={{
          color: "#fff",
          fontSize: 14,
          opacity: 0.87
        }}>{status.getDisplayName()}</Text>}

        {/*{ownerIsMe &&<Text style={{color: "#fff", textAlign: "right"}}>You</Text>}*/}

        <View style={{
          backgroundColor: ownerIsMe ? "green" : "#444",
          padding: 4,
          paddingHorizontal: 12,
          marginVertical: 0,
          borderRadius: 8,
          borderTopRightRadius: ownerIsMe ? 0 : 8,
          borderTopLeftRadius: !ownerIsMe ? 0 : 8,
          marginBottom: 8
        }}>
          {DescriptionContent}
        </View>
      </View>
      <View>
        {!ownerIsMe && <Text style={{
          color: "#fff",
          marginBottom: 0,
          fontSize: 12,
          opacity: 0.6,
          textAlign: "right"
        }}>
          {day}
        </Text>}
        {!ownerIsMe && <Text style={{
          color: "#fff",
          marginBottom: 8,
          fontSize: 10,
          opacity: 0.6
        }}>{time}</Text>}
      </View>
    </View>
  </View>
}

export default ChatItem