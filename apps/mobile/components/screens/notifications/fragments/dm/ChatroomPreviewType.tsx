import {useObject, useRealm} from "@realm/react"
import {
  ActivityPubChatRoom
} from "../../../../../entities/activitypub-chatroom.entity";
import React, {useEffect, useState} from "react";
import {Text} from "@rneui/themed"
import {TouchableOpacity, View} from "react-native";
import {BSON} from "realm";
import UUID = BSON.UUID;
import {Image} from "expo-image";
import {ActivityPubUser} from "../../../../../entities/activitypub-user.entity";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  ActivityPubStatus
} from "../../../../../entities/activitypub-status.entity";
import MfmService from "../../../../../services/mfm.service";
import {
  useActivityPubRestClientContext
} from "../../../../../states/useActivityPubRestClient";
import {randomUUID} from "expo-crypto";
import {
  ParsedDescriptionContainerForChatroomPreview
} from "../../../../../styles/Containers";
import {useNavigation} from "@react-navigation/native";
import {APP_FONT} from "../../../../../styles/AppTheme";
import {useGlobalMmkvContext} from "../../../../../states/useGlobalMMkvCache";


type ChatroomPreviewType = {
  roomId: UUID
  modeFilter: "me" | "dm" | "group"
}

function ChatroomPreview({roomId, modeFilter}: ChatroomPreviewType) {
  const {client, primaryAcct} = useActivityPubRestClientContext()
  const chatroom = useObject(ActivityPubChatRoom, roomId)
  const domain = primaryAcct?.domain
  const subdomain = primaryAcct?.subdomain


  const navigation = useNavigation<any>()

  const [Participants, setParticipants] = useState<ActivityPubUser[]>([])
  const [IsGroupChat, setIsGroupChat] = useState(false)
  const [IsSoloChat, setIsSoloChat] = useState(false)
  const [IsPairChat, setIsPairChat] = useState(false)
  const [Status, setStatus] = useState<ActivityPubStatus>(null)
  const [LastMessageBefore, setLastMessageBefore] = useState(null)
  const [DescriptionContent, setDescriptionContent] = useState(<></>)

  const me = chatroom?.me
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()

  useEffect(() => {
    if (!Status?.content) return

    const {reactNodes} = MfmService.renderMfm(Status?.content, {
      emojiMap: new Map(),
      domain,
      subdomain,
      db,
      globalDb
    })
    setDescriptionContent(<>
      {reactNodes?.map(
          (para, i) => {
            const uuid = randomUUID()
            return <Text
                key={uuid}
                style={{
                  color: APP_FONT.MONTSERRAT_BODY,
                  width: "100%",
                  overflow: "hidden",
                }}
                numberOfLines={1}
            >
              {para.map((o, j) => o)}
            </Text>
          }
      )}
    </>)

  }, [Status?.content]);


  useEffect(() => {
    if (chatroom.participants.length === 1 &&
        chatroom.participants[0].userId === chatroom.me.userId) {
      setIsSoloChat(true)
    } else if (chatroom.participants.length === 2) {
      setIsPairChat(true)
      setParticipants(chatroom.participants.filter((o) => o.userId !== chatroom.me.userId))
    } else {
      setIsGroupChat(true)
      setParticipants(chatroom.participants.filter((o) => o.userId !== chatroom.me.userId))
    }

    const statuses = chatroom.conversations.map((o) => o.latestStatus)
    if (statuses.length === 0) return

    const sorted = statuses.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
    setStatus(sorted[0])
    setLastMessageBefore(sorted[0].createdAt)
  }, [chatroom]);

  function onClickChatroomItem() {
    navigation.push("DirectMessagingRoom", {roomId: chatroom._id})
  }

  return <View style={{
    paddingHorizontal: 4,
    backgroundColor: "#141414",
    borderRadius: 8,
    marginBottom: 8
  }}>
    {modeFilter === "me" && IsSoloChat ? <View>
      <TouchableOpacity onPress={onClickChatroomItem}>
        <View style={{
          display: "flex", flexDirection: "row", backgroundColor: "#141414",
          paddingVertical: 4,
          marginVertical: 4
        }}>
          <View style={{flexGrow: 0}}>
            <View
                style={{
                  width: 48,
                  height: 48,
                  borderColor: "gray",
                  borderWidth: 2,
                  borderRadius: 4,
                  position: "relative"
                }}
            >
              <View style={{position: "absolute"}}>
                <FontAwesome5 name="crown" size={24} color="white" style={{
                  backgroundColor: "transparent",
                }}/>
              </View>

              <Image
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "#0553",
                    padding: 2,
                  }}
                  source={me?.avatarUrl}
              />
            </View>
          </View>
          <View style={{marginLeft: 8}}>
            <Text style={{
              fontSize: 16,
              color: APP_FONT.MONTSERRAT_HEADER,
              fontFamily: "Montserrat-Bold"
            }}>{me?.displayName}</Text>
            <Text style={{
              fontSize: 12,
              color: APP_FONT.MONTSERRAT_BODY,
              fontFamily: "Montserrat-Bold"
            }}>
              @{me?.username}@{me.server.url}
            </Text>
            {Status && Status?.postedBy?.userId === me.userId ?
                <ParsedDescriptionContainerForChatroomPreview>
                  {DescriptionContent}
                </ParsedDescriptionContainerForChatroomPreview> :
                <ParsedDescriptionContainerForChatroomPreview>
                  <Text
                      style={{color: "orange"}}>You: </Text>
                  {DescriptionContent}
                </ParsedDescriptionContainerForChatroomPreview>
            }
          </View>

          {/*<View style={{marginLeft: 4}}>*/}
          {/*  <WithActivitypubStatusContext status={chatroom.}>*/}
          {/*    <ConversationItem*/}
          {/*        displayName={me.userId}*/}
          {/*        accountUrl={me.userId}*/}
          {/*        unread={false}*/}
          {/*    />*/}
          {/*  </WithActivitypubStatusContext>*/}
          {/*</View>*/}
        </View>
      </TouchableOpacity>
    </View> : <View></View>}


    {modeFilter === "dm" && IsPairChat ? <View>
      <TouchableOpacity onPress={onClickChatroomItem}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          paddingVertical: 4,
          marginVertical: 4
        }}>
          <View style={{flexGrow: 0}}>
            <View
                style={{
                  width: 48,
                  height: 48,
                  borderColor: "gray",
                  borderWidth: 2,
                  borderRadius: 4,
                }}
            >
              <Image
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "#0553",
                    padding: 2,
                  }}
                  source={Participants[0]?.avatarUrl}
              />
            </View>
          </View>
          <View style={{marginLeft: 8}}>
            <Text style={{
              fontSize: 16,
              color: APP_FONT.MONTSERRAT_HEADER,
              fontFamily: "Montserrat-Bold"
            }}>{Participants[0]?.displayName}</Text>
            <Text style={{
              fontSize: 12,
              color: APP_FONT.MONTSERRAT_BODY,
              fontFamily: "Montserrat-Bold"
            }}>@{Participants[0]?.username}@{Participants[0]?.server?.url}</Text>
            {Status && Status?.postedBy?.userId === me.userId ?
                <ParsedDescriptionContainerForChatroomPreview>
                  <Text style={{color: APP_FONT.MONTSERRAT_BODY}}>You: </Text>
                  {DescriptionContent}
                </ParsedDescriptionContainerForChatroomPreview> :
                <ParsedDescriptionContainerForChatroomPreview>
                  <Text style={{color: APP_FONT.MONTSERRAT_BODY}}>You: </Text>
                  {DescriptionContent}
                </ParsedDescriptionContainerForChatroomPreview>
            }
          </View>

          {/*<View style={{marginLeft: 4}}>*/}
          {/*  <WithActivitypubStatusContext status={chatroom.}>*/}
          {/*    <ConversationItem*/}
          {/*        displayName={me.userId}*/}
          {/*        accountUrl={me.userId}*/}
          {/*        unread={false}*/}
          {/*    />*/}
          {/*  </WithActivitypubStatusContext>*/}
          {/*</View>*/}
        </View>
      </TouchableOpacity>
    </View> : <View></View>}
  </View>
}

export default ChatroomPreview;