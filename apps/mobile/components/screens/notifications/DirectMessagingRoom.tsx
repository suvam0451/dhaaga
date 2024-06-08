import {useQuery} from "@tanstack/react-query";
import {useObject} from "@realm/react"
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import WithActivitypubStatusContext, {
  useActivitypubStatusContext
} from "../../../states/useStatus";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useMemo, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {MMKV} from 'react-native-mmkv'

import {
  ActivityPubChatRoom
} from "../../../entities/activitypub-chatroom.entity";
import TitleOnlyStackHeaderContainer
  from "../../containers/TitleOnlyStackHeaderContainer";
import ActivitypubProviderService
  from "../../../services/activitypub-provider.service";
import {
  StatusInterface
} from "@dhaaga/shared-abstraction-activitypub/src";
import ActivityPubAdapterService
  from "../../../services/activitypub-adapter.service";
import ActivityPubProviderService
  from "../../../services/activitypub-provider.service";
import MmkvService from "../../../services/mmkv.service";
import ChatItem from "./fragments/dm/ChatItem";
import {Input} from '@rneui/themed';
import {FontAwesome} from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PostComposerActionSheet from "../../bottom-sheets/PostComposer";

type DirectMessagingRoomProps = {
  conversationIds: string[]
}

function WithContextWrapped() {
  const {client} = useActivityPubRestClientContext()
  const {setStatusContextData} = useActivitypubStatusContext()
  const route = useRoute<any>()
  const q = route?.params?.id;

  async function api() {
    if (!client) throw new Error("_client not initialized");
    return await client.getStatusContext(q);
  }

  // Queries
  const {status, data, refetch, fetchStatus} = useQuery<
      mastodon.v1.Conversation[] | Note[]
  >({
    queryKey: ["conversation/context"],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (status === "success") {
      setStatusContextData(data)
    }
  }, [status, fetchStatus])

  return <View></View>
}

type ChatItemPointer = {
  id: string,
  parentId: string,
  parentAcctId: string,
  createdAt: Date,
  conversationId: string
}

function DirectMessagingRoom() {
  const {client, primaryAcct} = useActivityPubRestClientContext()
  const navigation = useNavigation()
  const _domain = primaryAcct?.domain

  const route = useRoute<any>()
  const roomId = route?.params?.roomId;

  const chatroom = useObject(ActivityPubChatRoom, roomId)
  const [LatestStatuses, setLatestStatuses] = useState<string[]>([])
  const [MessageHistory, setMessageHistory] = useState<StatusInterface[]>([])

  const [ChatHistory, setChatHistory] = useState<ChatItemPointer[]>([])
  const [PostComposerVisible, setPostComposerVisible] = useState(false)

  const conversationMapper = useMemo(() => {
    return new Map<string, string>()
  }, [roomId])


  const mmkv = useMemo(() => {
    if (!roomId) return null
    return new MMKV({id: `chatroom/${roomId}`})
  }, [])

  useEffect(() => {
    const latestStatuses = chatroom.conversations.map((o) => o.latestStatus.statusId)
    let needsReevaluation = false
    for (let i = 0; i < latestStatuses.length; i++) {
      if (!LatestStatuses.includes(latestStatuses[i])) {
        needsReevaluation = true
        break
      }
    }
    if (LatestStatuses.length !== latestStatuses.length) needsReevaluation = true

    if (needsReevaluation) {
      setLatestStatuses(latestStatuses)
    }
  }, [roomId, chatroom]);


  function resolveHistory(input: ChatItemPointer[]) {
    input = input.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
    setChatHistory(input)
  }

  useEffect(() => {
    const promises = []
    for (let i = 0; i < LatestStatuses.length; i++) {
      promises.push(ActivityPubProviderService.getStatusAsArray(client, LatestStatuses[i]))
      promises.push(ActivitypubProviderService.getStatusContext(client, LatestStatuses[i]))
    }

    Promise.all(promises).then(async (res) => {
      let statuses = []
      let count = 0
      conversationMapper.clear()
      for await (const item of res) {
        if (item.ancestors !== undefined) {
          const interfaces = await ActivityPubAdapterService.adaptContextChain(item, _domain)
          statuses = statuses.concat(
              interfaces
          )
          for (let i = 0; i < interfaces.length; i++)
            conversationMapper.set(interfaces[i].getId(), chatroom.conversations[(count % 2) + 1].conversationId)

          MmkvService.saveRawStatuses(mmkv, interfaces)
        } else {
          const interfaces = await ActivityPubAdapterService.adaptManyStatuses(item, _domain)
          for (let i = 0; i < interfaces.length; i++)
            conversationMapper.set(interfaces[i].getId(), chatroom.conversations[(count % 2) + 1].conversationId)

          statuses = statuses.concat(
              interfaces
          )
          MmkvService.saveRawStatuses(mmkv, interfaces)
        }
      }
      setMessageHistory(statuses)
    }).catch((e) => {
      console.log("[ERROR]: populating chatroom history", e)
    })
  }, [LatestStatuses]);

  useEffect(() => {
    resolveHistory(MessageHistory.map((o) => ({
          id: o.getId(),
          parentId: o.getParentStatusId(),
          parentAcctId: o.getUserIdParentStatusUserId(),
          createdAt: new Date(o.getCreatedAt()),
          conversationId: conversationMapper.get(o.getId())
        })
    ))
  }, [MessageHistory]);

  // async function api() {
  //   if (!client) throw new Error("_client not initialized");
  //   return await client.getStatus(q);
  // }
  //
  // // Queries
  // const {status, data, refetch, fetchStatus} = useQuery<
  //     mastodon.v1.Status | Note
  // >({
  //   queryKey: ["conversation/latest"],
  //   queryFn: api,
  //   enabled: client !== null
  // });

  // useEffect(() => {
  //   if (status === "success") {
  //   }
  // }, [status, fetchStatus]);

  async function onRefresh() {

  }

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`Your Conversation With`}
      onScrollViewEndReachedCallback={() => {
      }}
      onRefresh={onRefresh}
  >
    <View style={{display: "flex", height: "100%"}}>
      <View style={{flexGrow: 1}}></View>
      <View>
        {ChatHistory.map((o, i) => <View key={i} style={{paddingHorizontal: 4}}>
          <WithActivitypubStatusContext
              status={MmkvService.getStatusRaw(mmkv, o.id)}>
            <ChatItem/>
          </WithActivitypubStatusContext>
        </View>)}
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%", height: "auto",
        backgroundColor: "#1c1c1c",
        padding: 8,
        alignItems: "flex-start",
        marginTop: 32
      }}>

        <TouchableOpacity onPress={() => {
          setPostComposerVisible(true)
        }}>
          <View style={{
            flexShrink: 1,
            display: "flex",
            flexDirection: "row",
            marginTop: 8,
            minWidth: 20,
          }}>
            <FontAwesome5 name="plus" size={24} color="#fff"/>
            {/*<FontAwesome6 name="face-smile" size={24} color="#fff"/>*/}
            {/*<FontAwesome6 name="image" size={24} color="#fff"/>*/}
            {/*<FontAwesome name="cog" size={24} color="#fff"/>*/}
          </View>
        </TouchableOpacity>

        <View style={{flexShrink: 1}}>
          <Input
              inputContainerStyle={{
                // borderRadius: 16,
                paddingLeft: 8,
                borderBottomWidth: 0
              }}
              containerStyle={{
                // borderRadius: 16,
              }}
              inputStyle={{
                textDecorationLine: "none"
              }}
              multiline={true}
              style={{
                fontSize: 16,
                borderRadius: 16,
                paddingLeft: 8,
                marginBottom: -24,
                lineHeight: 24,
                backgroundColor: "#363636",
                color: "white",
                textDecorationLine: "none",
                // textDecorationStyle: "dotted"
              }}
              placeholder={"Type Message here"}
          />
        </View>
        <View style={{
          marginTop: 8
        }}>
          <FontAwesome name="send" size={24} color="#fff"/>
        </View>

      </View>
    </View>
    <PostComposerActionSheet
        visible={PostComposerVisible}
        setVisible={setPostComposerVisible}/>
  </TitleOnlyStackHeaderContainer>
}

export default DirectMessagingRoom