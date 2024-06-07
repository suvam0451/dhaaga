import {View} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {APP_THEME} from "../../../styles/AppTheme";
import {DialogButtonGroupItem} from "../../../styles/Containers";
import React from "react";

type Props = {
  selected: boolean
  Icon: any
}

function TimelineCategoryTabViewIcon({selected, Icon}: Props) {
  return <DialogButtonGroupItem style={{flex: 1}}>
    <View style={{width: 24}}>
      {Icon}
    </View>
  </DialogButtonGroupItem>
}

export default TimelineCategoryTabViewIcon