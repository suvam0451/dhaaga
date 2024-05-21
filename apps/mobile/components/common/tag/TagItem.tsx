import {View} from "react-native";
import {useActivitypubTagContext} from "../../../states/useTag";
import {Text} from "@rneui/themed"

function TagItem() {
  const {tag} = useActivitypubTagContext()
  return <View><Text>{tag.getName()}</Text></View>
}

export default TagItem;