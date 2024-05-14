import TitleOnlyStackHeaderContainer
  from "../../components/containers/TitleOnlyStackHeaderContainer";
import StatusFragment from "../timelines/fragments/StatusFragment";
import {useEffect, useState} from "react";
import {ActivityPubStatus,} from "@dhaaga/shared-abstraction-activitypub/src";
import {useQuery} from "@tanstack/react-query";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import WithActivitypubStatusContext from "../../states/useStatus";

function Post({route, navigation}) {
  const q = route?.params?.id;
  const [refreshing, setRefreshing] = useState(false);
  const {client} = useActivityPubRestClientContext()

  function queryFn() {
    if (!client) {
      throw new Error("_client not initialized");
    }
    return client.getStatus(q);
  }

  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubStatus>({
        queryKey: ["mastodon/statuses", client, q],
        queryFn,
        enabled: q !== undefined,
      });

  useEffect(() => {
    if (status === "success") {
      setRefreshing(false);
    }
  }, [status, fetchStatus]);

  return <TitleOnlyStackHeaderContainer route={route} navigation={navigation}
                                        headerTitle={`#${q}`}>
    {data &&
        <WithActivitypubStatusContext status={data} key={0}>
            <StatusFragment/>
        </WithActivitypubStatusContext>
    }
  </TitleOnlyStackHeaderContainer>
}

export default Post;