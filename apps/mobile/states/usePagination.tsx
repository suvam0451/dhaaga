import {createContext, useContext, useMemo, useState} from "react";

type Type = {
  maxId?: string
  // updating this should result in a refetch
  queryCacheMaxId?: string
  sinceId?: string
  minId?: string,
  paginationLock: boolean
  data: any[]
  length: number
  isReachPageLimit: boolean
  setMaxId: (maxId: string) => void
  append: (data: any[], keygen?: (o: any) => any) => void
  clear: () => void
  updateQueryCache: () => void
}

const defaultValue: Type = {
  data: [],
  length: 0,
  paginationLock: false,
  isReachPageLimit: false,
  setMaxId: undefined,
  append: undefined,
  clear: undefined,
  updateQueryCache: function (): void {
    throw new Error("Function not implemented.");
  }
}

const AppPaginationContext =
    createContext<Type>(defaultValue);

export function useAppPaginationContext() {
  return useContext(AppPaginationContext);
}

/**
 * Handles pagination for ActivityPub related list items
 *
 * e.g. - Timelines, Posts etc.
 * @param children
 * @param ItemLimit indicates the number of items that
 * can be lazy loaded in page before going to the next
 * (performance considerations)
 * @constructor
 */
function WithAppPaginationContext({children}: any) {
  const [PageData, setPageData] = useState([])
  const [ItemLimit, setItemLimit] = useState(50)
  const [PaginationLock, setPaginationLock] = useState(false)
  const [PaginationParams, setPaginationParams] = useState({
    maxId: null,
    sinceId: null,
    minId: null,
  })
  const [ApiCache, setApiCache] = useState({
    queryCacheMaxId: null
  })

  const Seen = useMemo(() => {
    return new Set<string>()
  }, [])

  function updateQueryCache() {
    setApiCache({
      queryCacheMaxId: PaginationParams.maxId
    })
  }

  function clear() {
    setPaginationLock(true)
    Seen.clear()
    setPageData([])
    setPaginationParams({
      maxId: undefined,
      sinceId: undefined,
      minId: undefined
    })
    setApiCache({
      queryCacheMaxId: undefined
    })
    setPaginationLock(false)
  }

  function setMaxId(maxId: string) {
    setPaginationParams({
      maxId: maxId,
      sinceId: null,
      minId: undefined,
    })
  }

  function append(data: any[], keygen: Function) {
    const toAdd = []
    for (let i = 0; i < data.length; i++) {
      const targetId = keygen ? keygen(data[i]) : data[i]?.id
      if (Seen.has(targetId)) continue
      Seen.add(targetId)
      toAdd.push(data[i])
    }
    setPageData(PageData.concat(toAdd))
  }

  return <AppPaginationContext.Provider value={{
    data: PageData,
    length: PageData.length,
    setMaxId,
    append,
    clear,
    updateQueryCache,
    isReachPageLimit: PageData.length > ItemLimit,
    maxId: PaginationParams.maxId,
    queryCacheMaxId: ApiCache.queryCacheMaxId,
    minId: PaginationParams.minId,
    sinceId: PaginationParams.sinceId,
    paginationLock: PaginationLock
  }}>
    {children}
  </AppPaginationContext.Provider>
}

export default WithAppPaginationContext