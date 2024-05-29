import {useQuery} from "@tanstack/react-query";
import {useQuery as useRealmQuery, useObject} from "@realm/react"
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect} from "react";
import {View} from "react-native";
import {
  ActivityPubConversation
} from "../../../entities/activitypub-conversation.entity";

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

function DirectMessagingRoom() {
  const {client} = useActivityPubRestClientContext()
  const navigation = useNavigation()

  const route = useRoute<any>()
  const roomId = route?.params?.roomId;

  const conversation = useRealmQuery(ActivityPubConversation).filter(
      (o) => o.conversationId === roomId)

  useEffect(() => {
    console.log("[INFO]: room id is", roomId)
    console.log("[INFO]: conversation is", conversation)
  }, [roomId]);

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

  return <></>
}

export default DirectMessagingRoom