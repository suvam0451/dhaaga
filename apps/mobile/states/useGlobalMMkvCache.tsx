import {MMKV} from "react-native-mmkv";
import {createContext, useContext, useMemo, useRef} from "react";

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
  const _mmkv = useRef(new MMKV({id: `globalnode`}))
  const mmkv = _mmkv.current

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