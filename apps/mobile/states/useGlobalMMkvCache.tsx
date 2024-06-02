import {MMKV} from "react-native-mmkv";
import {createContext, useContext, useMemo} from "react";

type Type = {
  globalDb: MMKV | null
  clear: () => void
}

const defaultValue: Type = {
  globalDb: null,
  clear: function (): void {
    throw new Error("Function not implemented.");
  }
}


const GlobalMmkvContext =
    createContext<Type>(defaultValue);

export function useGlobalMmkvContext() {
  return useContext(GlobalMmkvContext);
}


type Props = {
  children: any
}


function WithGlobalMmkvContext({children}: Props) {
  const mmkv = useMemo(() => {
    return new MMKV({id: `globalnode`})
  }, [])

  /**
   * Clear all known keys used for exchanging raw objects
   * between components
   */
  function clear() {
  }

  return <GlobalMmkvContext.Provider value={{globalDb: mmkv, clear}}>
    {children}
  </GlobalMmkvContext.Provider>
}

export default WithGlobalMmkvContext