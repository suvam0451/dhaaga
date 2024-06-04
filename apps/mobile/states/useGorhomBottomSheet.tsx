import React, {
  createContext,
  useContext, useEffect,
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
      default:
        return <View></View>
    }
  }, [requestId])
}

function WithGorhomBottomSheetContext({children}: Props) {
  const [BottomSheetVisible, setBottomSheetVisible] = useState(false)
  const [BottomSheetType, setBottomSheetType] = useState("N/A")
  const [SnapPoints, setSnapPoints] = useState([])
  const [RequestId, setRequestId] = useState(null)
  const ref = useRef<BottomSheet>()

  useEffect(() => {
    switch (BottomSheetType) {
      case "Hashtag": {
        setSnapPoints(["40%"])
        break
      }
      case "Link": {
        setSnapPoints([600])
        break
      }
      default: {
        setSnapPoints(["40%"])
        break
      }
    }
  }, [BottomSheetType]);

  function setVisible(state: boolean) {
    setBottomSheetVisible(state)
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

  return <GorhomBottomSheetContext.Provider value={{
    visible: BottomSheetVisible,
    type: "N/A",
    setVisible,
    setBottomSheetContent: setter,
    setBottomSheetType: setBottomSheetTypeFn,
    updateRequestId: updateRequestIdFn
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
        handleIndicatorStyle={{backgroundColor: "#fff"}}
    >
      <BottomSheetView>
        <BottomSheetContent type={BottomSheetType} requestId={RequestId}/>
      </BottomSheetView>
    </BottomSheet>
  </GorhomBottomSheetContext.Provider>
}

export default WithGorhomBottomSheetContext