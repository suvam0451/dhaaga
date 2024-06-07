import {
  ActivitypubStatusAdapter,
  StatusInterface,
} from "@dhaaga/shared-abstraction-activitypub/src";
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useActivityPubRestClientContext} from "./useActivityPubRestClient";
import {useSelector} from "react-redux";
import {RootState} from "../libs/redux/store";
import {AccountState} from "../libs/redux/slices/account";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  StatusContextInterface
} from "@dhaaga/shared-abstraction-activitypub/src/adapters/status/_interface";
import {
  ActivityPubStatusContextAdapter
} from "@dhaaga/shared-abstraction-activitypub/src/adapters/status/_adapters";
import MastodonService from "../services/mastodon.service";

type OgObject = {
  url: string,
  title: string,
  siteName: string,
  description: string,
  mediaType: string,
  contentType: string,
  images: string[],
  videos: {
    url: string,
    secureUrl: string,
    type: string,
    width: string,
    height: string
  }[],
  favicons: string[]
}

type Type = {
  status: StatusInterface | null
  statusContext: StatusContextInterface | null
  sharedStatus: StatusInterface | null
  openGraph: OgObject | null

  statusRaw: mastodon.v1.Status | Note | null
  setData: (o: StatusInterface) => void
  setStatusContextData: (data: any) => void
  setDataRaw: (o: mastodon.v1.Status | Note) => void
  updateOpenGraph: (og: OgObject | null) => void
  toggleBookmark: () => void,
}

const defaultValue: Type = {
  openGraph: undefined,
  updateOpenGraph(og: OgObject | null): void {
  },
  setDataRaw(o: mastodon.v1.Status | Note): void {
  },
  setData(o: StatusInterface): void {
  },
  status: null,
  sharedStatus: null,
  statusRaw: null,
  toggleBookmark: () => {
  },
  statusContext: undefined,
  setStatusContextData: function (data: any): void {
    throw new Error("Function not implemented.");
  }
}

const ActivitypubStatusContext =
    createContext<Type>(defaultValue);


export function useActivitypubStatusContext() {
  return useContext(ActivitypubStatusContext);
}

type Props = {
  status?: mastodon.v1.Status | Note,
  statusInterface?: StatusInterface
  children: any
}

function WithActivitypubStatusContext({
  status,
  statusInterface,
  children
}: Props) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const _domain = accountState?.activeAccount?.domain

  const {client} = useActivityPubRestClientContext()
  const [Status, setStatus] = useState<StatusInterface | null>
  (ActivitypubStatusAdapter(null, _domain))
  const [StatusContext, setStatusContext] = useState<StatusContextInterface | null>(
      ActivityPubStatusContextAdapter(null, _domain)
  )

  const contextItemLookup = useRef<Map<string, StatusInterface>>();
  const contextChildrenLookup = useRef<Map<string, StatusInterface[]>>();
  const contextRootLookup = useRef<StatusInterface>();

  const [SharedStatus, setSharedStatus] = useState<StatusInterface | null>(
      ActivitypubStatusAdapter(null, _domain)
  )

  const [StatusRaw, setStatusRaw] = useState<mastodon.v1.Status | Note | null>(null)
  const [OpenGraph, setOpenGraph] = useState<OgObject | null>(null)


  // init
  useEffect(() => {
    if (status) {
      setStatusRaw(status)
      const adapted = ActivitypubStatusAdapter(status, _domain)
      setStatus(adapted)
      if (adapted.isReposted()) {
        const repostAdapted = ActivitypubStatusAdapter(adapted.getRepostedStatusRaw(), _domain)
        setSharedStatus(repostAdapted)
      }
    } else if (statusInterface) {
      setStatus(statusInterface)
      if (statusInterface.isReposted()) {
        const repostAdapted = ActivitypubStatusAdapter(statusInterface.getRepostedStatusRaw(), _domain)
        setSharedStatus(repostAdapted)
      }
    }
  }, [status, statusInterface]);

  function setData(o: StatusInterface) {
    setStatus(o)
  }

  function setStatusContextData(data: mastodon.v1.Context | any) {
    const {
      root,
      itemLookup,
      childrenLookup
    } = MastodonService.solveContext(Status, data, _domain)
    contextRootLookup.current = root
    contextItemLookup.current = itemLookup
    contextChildrenLookup.current = childrenLookup
  }

  function setDataRaw(o: mastodon.v1.Status | Note) {
    const adapted = ActivitypubStatusAdapter(o, _domain)
    if (adapted.isReposted()) {
      const repostAdapted = ActivitypubStatusAdapter(adapted.getRepostedStatusRaw(),
          _domain)
      setSharedStatus(repostAdapted)
    }
    setStatus(adapted)
  }

  function updateOpenGraph(og) {
    setOpenGraph(og)
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
    statusContext: StatusContext,
    openGraph: OpenGraph,
    sharedStatus: SharedStatus,
    statusRaw: StatusRaw,
    setData,
    setDataRaw,
    toggleBookmark,
    updateOpenGraph,
    setStatusContextData,
  }}>
    {children}
  </ActivitypubStatusContext.Provider>
}

export default WithActivitypubStatusContext;