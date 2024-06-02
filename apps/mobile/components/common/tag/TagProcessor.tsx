import {Text, View, Pressable} from "react-native";

import {
  useGorhomActionSheetContext
} from "../../../states/useGorhomBottomSheet";
import GlobalMmkvCacheService from "../../../services/globalMmkvCache.services";
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";

function HashtagProcessor({
  content,
  forwardedKey,
}: {
  content: string;
  forwardedKey: string | number;
}) {
  const {
    setVisible,
    setBottomSheetType,
    updateRequestId
  } = useGorhomActionSheetContext()
  const {globalDb} = useGlobalMmkvContext()

  const onPress = () => {
    GlobalMmkvCacheService.setBottomSheetProp_Hashtag(globalDb, {
      name: content,
      remoteInstance: "N/A"
    })
    setBottomSheetType("Hashtag")
    updateRequestId()
    setVisible(true)
  };

  return <Text onPress={onPress} key={forwardedKey} style={{color: "#bb86fc", opacity: 1}}>
    #{content}
  </Text>
}

export default HashtagProcessor;
