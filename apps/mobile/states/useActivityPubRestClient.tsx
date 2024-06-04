import {createContext, useContext, useEffect, useState} from "react";
import {
  ActivityPubClientFactory, ActivityPubUserAdapter,
  MastodonRestClient,
  MisskeyRestClient, UnknownRestClient, UserInterface
} from "@dhaaga/shared-abstraction-activitypub/src";
import {useSelector} from "react-redux";
import {RootState} from "../libs/redux/store";
import {AccountState} from "../libs/redux/slices/account";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import AccountRepository from "../repositories/account.repo";
import {useRealm} from "@realm/react";
import {Account} from "../entities/account.entity";

type Type = {
  client: MastodonRestClient | MisskeyRestClient | UnknownRestClient | null,
  me: UserInterface | null
  meRaw: mastodon.v1.Account | null
}

const defaultValue = {
  client: null,
  me: null,
  meRaw: null
}

const ActivityPubRestClientContext =
    createContext<Type>(defaultValue);

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
  const _domain = accountState?.activeAccount?.domain

  const [restClient, setRestClient] = useState<
      MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
  >(null);
  const [Me, setMe] = useState(null)
  const [MeRaw, setMeRaw] = useState(null)
  const db = useRealm()

  useEffect(() => {
    const acctI = accountState?.activeAccount
    if (!acctI) {
      setRestClient(null)
      return;
    }

    const acct = db.objects(Account)
        .find((o) => o._id.toString() === acctI.id)

    const token = AccountRepository.findSecret(
        db, acct, "access_token")?.value

    if (!token) {
      setRestClient(null)
      return;
    }

    setRestClient(ActivityPubClientFactory.get(
        acct.domain as any,
        {
          instance: acct?.subdomain,
          token,
        }
    ))
  }, [accountState?.activeAccount]);

  useEffect(() => {
    if (!restClient) {
      setMe(null)
      return
    }
    restClient.getMe().then((res) => {
      setMeRaw(res)
      setMe(ActivityPubUserAdapter(res, _domain))
    })
  }, [restClient])

  return <ActivityPubRestClientContext.Provider value={{
    client: restClient,
    me: Me,
    meRaw: MeRaw
  }}>
    {children}
  </ActivityPubRestClientContext.Provider>
}

export default WithActivityPubRestClient