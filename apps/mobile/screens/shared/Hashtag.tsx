import {useQuery} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import StatusFragment from "../timelines/fragments/StatusFragment";
import {Skeleton} from "@rneui/base";
import {
  ActivityPubStatuses,
} from "@dhaaga/shared-abstraction-activitypub/src";
import TitleOnlyStackHeaderContainer
  from "../../components/containers/TitleOnlyStackHeaderContainer";
import WithActivitypubStatusContext from "../../states/useStatus";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";

function Hashtag({route, navigation}) {
  const q = route?.params?.q;
  const {client} = useActivityPubRestClientContext()

  const [refreshing, setRefreshing] = useState(false);

  function api() {
    if (!client)
      throw new Error("_client not initialized");
    return client.getTimelineByHashtag(q);
  }

  // Queries
  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubStatuses>({
        queryKey: ["mastodon/timelines/tag", q],
        queryFn: api,
        enabled: client && q !== undefined,
      });

  useEffect(() => {
    if (status === "success") {
      setRefreshing(false);
    }
  }, [status, fetchStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
  }, []);

  return <TitleOnlyStackHeaderContainer route={route} navigation={navigation}
                                        headerTitle={`#${q}`}>
    {data ? data.map((o, i) => (
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusFragment key={i}/>
        </WithActivitypubStatusContext>
    )) : <Skeleton/>}
  </TitleOnlyStackHeaderContainer>
}

export default Hashtag;
