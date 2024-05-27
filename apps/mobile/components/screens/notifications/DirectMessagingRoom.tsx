import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useRoute} from "@react-navigation/native";
import {useEffect} from "react";

type DirectMessagingRoomProps = {
  lastStatusId: string
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

  return <></>
}

function DirectMessagingRoom({lastStatusId}: DirectMessagingRoomProps) {
  const {client} = useActivityPubRestClientContext()

  const route = useRoute<any>()
  const q = route?.params?.id;

  async function api() {
    if (!client) throw new Error("_client not initialized");
    return await client.getStatus(q);
  }

  // Queries
  const {status, data, refetch, fetchStatus} = useQuery<
      mastodon.v1.Status | Note
  >({
    queryKey: ["conversation/latest"],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (status === "success") {
    }
  }, [status, fetchStatus]);

  return <><WithContextWrapped/></>
}

function ContextWrappers() {

}

export default DirectMessagingRoom