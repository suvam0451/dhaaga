import {useActivitypubStatusContext} from "../../../../../states/useStatus";
import {Text, View} from "react-native";
import {
  useActivityPubRestClientContext
} from "../../../../../states/useActivityPubRestClient";
import React, {useMemo, useState} from "react";
import MfmService from "../../../../../services/mfm.service";
import {randomUUID} from "expo-crypto";
import {Image} from "expo-image";
import {format} from "date-fns";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../../../../states/useGlobalMMkvCache";
import {
  ActivityPubUserAdapter
} from "@dhaaga/shared-abstraction-activitypub/src";

function ChatItem() {
  const {status} = useActivitypubStatusContext()
  const {me, primaryAcct} = useActivityPubRestClientContext()
  const domain = primaryAcct?.domain
  const subdomain = primaryAcct?.subdomain


  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const [UserInterface, setUserInterface] = useState(ActivityPubUserAdapter(null, domain))

  let content = status.getContent();

  const DescriptionContent = useMemo(() => {
    const target = status?.getContent()
    if (!target) return <View></View>

    const emojiMap = new Map()
    const {reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain,
      subdomain,
      remoteSubdomain: UserInterface?.getInstanceUrl(),
      db,
      globalDb
    })
    return reactNodes?.map(
        (para) => {
          const uuid = randomUUID()
          return <Text key={uuid} style={{marginBottom: 8, opacity: 0.87}}>
            {para.map((o) => o)}
          </Text>
        }
    )
  }, [
    status?.getContent()
  ])

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