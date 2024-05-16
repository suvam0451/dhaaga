import {StatusInterface} from "@dhaaga/shared-abstraction-activitypub/src";
import {createContext, useContext, useEffect, useState} from "react";
import {useActivityPubRestClientContext} from "./useActivityPubRestClient";
import {adaptSharedProtocol} from "../utils/activitypub-adapters";
import {useSelector} from "react-redux";
import {RootState} from "../libs/redux/store";
import {AccountState} from "../libs/redux/slices/account";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";

type Type = {
  status: StatusInterface | null
  statusRaw: mastodon.v1.Status | Note | null
  setData: (o: StatusInterface) => void
  setDataRaw: (o: mastodon.v1.Status | Note) => void
  toggleBookmark: () => void,
}

const defaultValue: Type = {
  setDataRaw(o: mastodon.v1.Status | Note): void {
  },
  setData(o: StatusInterface): void {
  },
  status: null,
  statusRaw: null,
  toggleBookmark: () => {
  }
}

const ActivitypubStatusContext =
    createContext<Type>(defaultValue);


export function useActivitypubStatusContext() {
  return useContext(ActivitypubStatusContext);
}

type WithActivitypubStatusContextProps = {
  status: mastodon.v1.Status | Note,
  children: any
}

function WithActivitypubStatusContext({
  status,
  children
}: WithActivitypubStatusContextProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {client} = useActivityPubRestClientContext()

  const [Status, setStatus] = useState<StatusInterface | null>
  (adaptSharedProtocol(null, accountState?.activeAccount?.domain))
  const [StatusRaw, setStatusRaw] = useState<mastodon.v1.Status | Note | null>(null)
  useEffect(() => {
    setStatusRaw(status)
    setStatus(adaptSharedProtocol(status, accountState?.activeAccount?.domain))
  }, [status]);

  function setData(o: StatusInterface) {
    setStatus(o)
  }

  function setDataRaw(o: mastodon.v1.Status | Note) {
    setStatus(adaptSharedProtocol(o, accountState?.activeAccount?.domain))
  }

  async function toggleBookmark() {
    if (!client) return
    try {
      if (Status?.getIsBookmarked()) {
        const res = await client.unBookmark(Status.getId());
        setDataRaw(res)
      } else {
        const res = await client.bookmark(Status.getId());
        setDataRaw(res)
      }
    } catch (e) {
      console.log("[ERROR] : toggling bookmark")
    }
  }

  return <ActivitypubStatusContext.Provider value={{
    status: Status,
    statusRaw: StatusRaw,
    setData,
    setDataRaw,
    toggleBookmark
  }}>
    {children}
  </ActivitypubStatusContext.Provider>
}

export default WithActivitypubStatusContext;