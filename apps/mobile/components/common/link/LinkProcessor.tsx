import React, {useState} from "react";
import ExternalLinkDisplayName from "../../utils/ExternalLinkDisplayName";
import {TouchableOpacity} from "react-native";
import ExternalLinkActionSheet from "../../bottom-sheets/Link";

type LinkProcessorProps = {
  url: string,
  displayName: string
}

function LinkProcessor({url, displayName}: LinkProcessorProps) {
  const [BottomSheetVisible, setBottomSheetVisible] = useState(false)

  return <>
    <TouchableOpacity onPress={() => {
      setBottomSheetVisible(true)
    }}>
      <ExternalLinkDisplayName displayName={displayName || url}/>
    </TouchableOpacity>
    {/*<ExternalLinkActionSheet*/}
    {/*    visible={BottomSheetVisible}*/}
    {/*    setVisible={setBottomSheetVisible} url={url}/>*/}
  </>
}

export default LinkProcessor