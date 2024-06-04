import {Text} from "@rneui/themed"
import {View} from "react-native";
import React from "react";
import {APP_THEME} from "../../styles/AppTheme";
import GlobalMmkvCacheServices from "../../services/globalMmkvCache.services";
import {useGlobalMmkvContext} from "../../states/useGlobalMMkvCache";
import {useGorhomActionSheetContext} from "../../states/useGorhomBottomSheet";

type ExternalLinDisplayNameProps = {
  displayName: string
}

function ExternalLinkDisplayName({displayName}: ExternalLinDisplayNameProps) {
  const httpsRemoved = displayName.replace(/(https:\/\/)(.+)/, "$2")
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

  return <View style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: -4,
    maxWidth: 196,
  }}>
    <Text
        numberOfLines={1}
        style={{
          color: APP_THEME.LINK,
          fontFamily: "Inter-Bold"
        }}
        onPress={onTextPress}
    >{wwwRemoved}</Text>
    {/*<View style={{marginLeft: 2}}>*/}
    {/*  <Ionicons*/}
    {/*      name="open-outline"*/}
    {/*      size={16}*/}
    {/*      color={APP_THEME.LINK}*/}
    {/*  />*/}
    {/*</View>*/}
  </View>
}

export default ExternalLinkDisplayName