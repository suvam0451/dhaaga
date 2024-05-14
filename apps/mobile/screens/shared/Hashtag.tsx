import {useQuery} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import StatusFragment from "../timelines/fragments/StatusFragment";
import {Skeleton} from "@rneui/base";
import {
  ActivityPubClientFactory,
  ActivityPubStatuses,
  MastodonRestClient,
  MisskeyRestClient,
  UnknownRestClient,
} from "@dhaaga/shared-abstraction-activitypub/src";
import TitleOnlyStackHeaderContainer from "../../components/containers/TitleOnlyStackHeaderContainer";

function Hashtag({route, navigation}) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const q = route?.params?.q;
  const restClient = useRef<
      MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!accountState.activeAccount) {
      restClient.current = null;
      return;
    }

    const token = accountState.credentials.find(
        (o) => o.credential_type === "access_token"
    )?.credential_value;
    if (!token) {
      restClient.current = null;
      return;
    }

    restClient.current = ActivityPubClientFactory.get(
        accountState.activeAccount.domain as any,
        {
          instance: accountState.activeAccount.subdomain,
          token,
        }
    );
  }, [accountState]);

  function queryFn() {
    if (!restClient.current)
      throw new Error("_client not initialized");
    return restClient.current.getTimelineByHashtag(q);
  }

  // Queries
  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubStatuses>({
        queryKey: ["mastodon/timelines/tag", restClient.current, q],
        queryFn,
        enabled: q !== undefined,
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

  return <TitleOnlyStackHeaderContainer route={route} navigation={navigation} headerTitle={`#${q}`}>
    {data ? data.map((o, i) => (
        <StatusFragment key={i}/>
    )) : <Skeleton/>}
  </TitleOnlyStackHeaderContainer>
}

export default Hashtag;
