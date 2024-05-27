import {useNavigation, useRoute} from "@react-navigation/native";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../states/usePagination";
import TitleOnlyStackHeaderContainer
  from "../../containers/TitleOnlyStackHeaderContainer";
import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useEffect} from "react";
import ConversationListItem from "./fragments/dm/ConversationListItem";
import {
  ActivityPubUserAdapter
} from "@dhaaga/shared-abstraction-activitypub/src";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {View} from "react-native";

function WithApi() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const _domain = accountState?.activeAccount?.domain
  const {client} = useActivityPubRestClientContext()
  const navigation = useNavigation()
  const route = useRoute<any>()
  const {
    data: PageData,
    updateQueryCache,
    append
  } = useAppPaginationContext()


  async function api() {
    if (!client) {
      return []
    }
    const data: mastodon.v1.Conversation[] = await client.getMyConversations()
    return data
  }

  // Queries
  const {status, data, refetch, fetchStatus} = useQuery<
      mastodon.v1.Conversation[] | Note[]
  >({
    queryKey: ["conversations"],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (fetchStatus === "fetching") return
    if (status !== "success") return
    append(data, (o: mastodon.v1.Conversation) => o.id)
  }, [fetchStatus]);

  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
  }

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`My Conversations`}
      onScrollViewEndReachedCallback={onScrollEndReach}
  >
    <View style={{paddingVertical: 8, paddingHorizontal: 8}}>{
      PageData.map((o) =>
          <ConversationListItem lastStatus={o.lastStatus} accounts={
            o.accounts.map((j) => ActivityPubUserAdapter(j, _domain))}/>
      )}
    </View>
  </TitleOnlyStackHeaderContainer>
}

function WithContexts() {
  return <WithAppPaginationContext>
    <WithApi/>
  </WithAppPaginationContext>
}

/**
 * This Screen lists the direct conversations
 * of the user.
 * @constructor
 */
function DirectMessaging() {
  return <WithContexts/>
}

export default DirectMessaging