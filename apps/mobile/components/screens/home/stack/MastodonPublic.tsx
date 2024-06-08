import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import React from "react";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {View} from "react-native";

function WithApi() {
  const {client, primaryAcct} = useActivityPubRestClientContext()
  const domain = primaryAcct?.domain

  const {
    queryCacheMaxId
  } = useAppPaginationContext()

  const api = () => client ? client.getHomeTimeline({
    limit: 5,
    maxId: queryCacheMaxId
  }) : null
  return <View></View>
}


function MastodonPublic() {
  return <WithAppPaginationContext>
    <WithApi/>
  </WithAppPaginationContext>
}

export default MastodonPublic