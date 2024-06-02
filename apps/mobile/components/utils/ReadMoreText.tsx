import {View} from "react-native"
import {Text} from "@rneui/themed"
import {useState} from "react";

type ReadMoreTextProps = {
  text: string
  maxLines?: number
  bold?: boolean,
}

function ReadMoreText({text, maxLines = 2, bold = false}: ReadMoreTextProps) {
  const [show, setShow] = useState(false); //To show ur remaining Text
  const [showPrompt, setShowPrompt] = useState(false); //to show the "Read more & Less Line"
  const toggleShowMoreLess = () => { //To toggle the show text or hide it
    setShow(!show);
  }

  function onTextLayout(e: any) {
    setShowPrompt(e.nativeEvent.lines.length >= maxLines);
  }

  return <View style={{
    height: 20 * maxLines,
    overflow: "hidden",
  }}><Text
      onTextLayout={onTextLayout}
      numberOfLines={show ? undefined : maxLines}
      style={{
        opacity: bold ? 0.87 : 0.6,
        fontWeight: bold ? 700 : 400
      }}
  >
    {text}
  </Text>
  </View>
}

export default ReadMoreText;