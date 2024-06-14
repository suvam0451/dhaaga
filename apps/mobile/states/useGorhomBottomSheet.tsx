import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  SNAP_POINT_TYPE
} from "@gorhom/bottom-sheet";
import {View} from "react-native";
import HashtagBottomSheet from "../components/bottom-sheets/Hashtag";
import {useGlobalMmkvContext} from "./useGlobalMMkvCache";
import globalMmkvCacheServices from "../services/globalMmkvCache.services";
import * as Crypto from "expo-crypto";
import ExternalLinkActionSheet from "../components/bottom-sheets/Link";
import PostComposerBottomSheet from "../components/bottom-sheets/PostComposer";
import {APP_FONT, APP_THEME} from "../styles/AppTheme";

type Type = {
  visible: boolean,
  type: string | null
  setVisible: (state: boolean) => void
  setBottomSheetContent: (content: any) => void
  setBottomSheetType: (input: string) => void
  updateRequestId: () => void
}

const defaultValue: Type = {
  visible: false,
  type: null,
  setVisible: function (state: boolean): void {
    throw new Error("Function not implemented.");
  },
  setBottomSheetContent: function (content: any): void {
    throw new Error("Function not implemented.");
  },
  setBottomSheetType: function (input: string): void {
    throw new Error("Function not implemented.");
  },
  updateRequestId: undefined
}


const GorhomBottomSheetContext =
    createContext<Type>(defaultValue);

export function useGorhomActionSheetContext() {
  return useContext(GorhomBottomSheetContext);
}

type Props = {
  children: any,
}

/**
 * @param type of bottom sheet to show
 * @param requestId updates the component state/data
 * @constructor
 */
function BottomSheetContent({type, requestId}: {
  type: string,
  requestId: string
}) {
  const {globalDb} = useGlobalMmkvContext()

  return useMemo(() => {
    switch (type) {
      case "Hashtag": {
        const x = globalMmkvCacheServices.getBottomSheetProp_Hashtag(globalDb)
        if (!x) return <View></View>
        return <HashtagBottomSheet
            visible={true}
            id={x.name}
        />
      }
      case "Link": {
        const x = globalMmkvCacheServices.getBottomSheetProp_Link(globalDb)
        if (!x) return <View></View>
        return <ExternalLinkActionSheet
            url={x.url}
            displayName={x.displayName}
        />
      }
      case "Composer": {
        return <PostComposerBottomSheet/>
      }
      default:
        return <View></View>
    }
  }, [requestId])
}

function WithGorhomBottomSheetContext({children}: Props) {
  // const [BottomSheetVisible, setBottomSheetVisible] = useState(false)
  const [BottomSheetType, setBottomSheetType] = useState("N/A")
  const [RequestId, setRequestId] = useState(null)
  const ref = useRef<BottomSheet>()

  function setVisible(state: boolean) {
    // setBottomSheetVisible(state)
    ref?.current?.expand()
  }

  function close() {
    setVisible(false)
  }

  function setter(input: any) {
    // setBottomSheetContent(input)
  }

  function setBottomSheetTypeFn(input: string) {
    setBottomSheetType(input)
  }

  function onBottomSheetChanged(index: number, position: number, type: SNAP_POINT_TYPE) {
  }

  /**
   * Updating the UUID after saving all relevant data in cache
   * Will cause the bottom sheet to refetch/update
   */
  function updateRequestIdFn() {
    setRequestId(Crypto.randomUUID())
  }

  const Content = useMemo(() => {
    return <BottomSheetContent type={BottomSheetType} requestId={RequestId}/>
  }, [RequestId])

  return <GorhomBottomSheetContext.Provider value={{
    visible: false,
    type: "N/A",
    setVisible,
    setBottomSheetContent: setter,
    setBottomSheetType: setBottomSheetTypeFn,
    updateRequestId: updateRequestIdFn,
  }}>
    {children}
    <BottomSheet
        onChange={onBottomSheetChanged}
        ref={ref}
        index={-1}
        enablePanDownToClose={true}
        enableOverDrag={false}
        snapPoints={["50%"]}
        backgroundStyle={{
          backgroundColor: "#2C2C2C"
        }}
        backdropComponent={(props) => <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            enableTouchThrough={false}
        />}
        handleIndicatorStyle={{backgroundColor: APP_FONT.MONTSERRAT_BODY}}
    >
      <BottomSheetView>
        {Content}
      </BottomSheetView>
    </BottomSheet>
  </GorhomBottomSheetContext.Provider>
}

export default WithGorhomBottomSheetContext