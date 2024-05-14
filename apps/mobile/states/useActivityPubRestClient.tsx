import {createContext, useContext, useEffect, useState} from "react";
import {
  ActivityPubClientFactory,
  MastodonRestClient,
  MisskeyRestClient, UnknownRestClient
} from "@dhaaga/shared-abstraction-activitypub/src";
import {useSelector} from "react-redux";
import {RootState} from "../libs/redux/store";
import {AccountState} from "../libs/redux/slices/account";

type YinAuthContextType = {
  client: MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
}

const defaultValue = {
  client: null
}

const ActivityPubRestClientContext =
    createContext<YinAuthContextType>(defaultValue);

export function useActivityPubRestClientContext() {
  return useContext(ActivityPubRestClientContext);
}


/**
 * Provides context with ActivityPub _client
 * @param children
 * @constructor
 */
function WithActivityPubRestClient({children}: any) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const [restClient, setRestClient] = useState<
      MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
  >(null);

  useEffect(() => {
    if (!accountState.activeAccount) {
      setRestClient(null)
      return;
    }

    const token = accountState.credentials.find(
        (o) => o.credential_type === "access_token"
    )?.credential_value;
    if (!token) {
      setRestClient(null)
      return;
    }

    setRestClient(ActivityPubClientFactory.get(
        accountState.activeAccount.domain as any,
        {
          instance: accountState.activeAccount.subdomain,
          token,
        }
    ))
  }, [accountState]);

  return <ActivityPubRestClientContext.Provider value={{
    client: restClient
  }}>
    {children}
  </ActivityPubRestClientContext.Provider>
}

export default WithActivityPubRestClient