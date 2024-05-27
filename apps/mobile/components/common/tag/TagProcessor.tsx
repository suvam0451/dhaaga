import {Text} from "react-native";
import HashtagBottomSheet from "../../bottom-sheets/Hashtag";
import {useState} from "react";

function HashtagProcessor({
  content,
  forwardedKey,
}: {
  content: string;
  forwardedKey: string | number;
}) {
  const [BottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false)

  const onPress = () => {
    setBottomSheetVisible(true)
  };

  return <>
    <HashtagBottomSheet
        visible={BottomSheetVisible}
        setVisible={setBottomSheetVisible}
        id={content}
    />
    <Text onPress={onPress} key={forwardedKey} style={{color: "#bb86fc"}}>
      #{content}
    </Text>
  </>
}

export default HashtagProcessor;
