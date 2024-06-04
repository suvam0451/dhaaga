import React from "react";
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";
import {
  useGorhomActionSheetContext
} from "../../../states/useGorhomBottomSheet";
import GlobalMmkvCacheServices
  from "../../../services/globalMmkvCache.services";
import {Text} from "@rneui/themed";
import {APP_THEME} from "../../../styles/AppTheme";

type LinkProcessorProps = {
  url: string,
  displayName: string
}

function LinkProcessor({url, displayName}: LinkProcessorProps) {
  const httpsRemoved = url.replace(/(https:\/\/)(.+)/, "$2")
  const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, httpsRemoved)
  const {globalDb} = useGlobalMmkvContext()
  const {
    setVisible,
    setBottomSheetType,
    updateRequestId
  } = useGorhomActionSheetContext()

  function onTextPress() {

    GlobalMmkvCacheServices.setBottomSheetProp_Link(globalDb, {
      url: displayName,
      displayName: wwwRemoved
    })
    setBottomSheetType("Link")
    updateRequestId()
    setVisible(true)
  }

  return <Text
      numberOfLines={1}
      style={{
        color: APP_THEME.LINK,
        fontFamily: "Inter-Bold",
        maxWidth: 128,
      }}
      onPress={onTextPress}
  >{wwwRemoved}</Text>
}

{/*<View style={{marginLeft: 2}}>*/
}
{/*  <Ionicons*/
}
{/*      name="open-outline"*/
}
{/*      size={16}*/
}
{/*      color={APP_THEME.LINK}*/
}
{/*  />*/
}
{/*</View>*/
}

export default LinkProcessor