import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../libs/redux/store";
import {AccountState} from "../../../../libs/redux/slices/account";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../../../states/useGlobalMMkvCache";
import { View } from "react-native";

function WithApi() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const {client} = useActivityPubRestClientContext()
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const {
    data: PageData,
    setMaxId,
    append,
    maxId,
    clear,
    paginationLock,
    updateQueryCache,
    queryCacheMaxId
  } = useAppPaginationContext()

  const api = () => client ? client.getHomeTimeline({limit: 5, maxId: queryCacheMaxId}) : null
  return <View></View>


}


function MastodonPublic() {
  return <WithAppPaginationContext>
    <WithApi/>
  </WithAppPaginationContext>
}

export default MastodonPublic