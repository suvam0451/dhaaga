import ogs from "open-graph-scraper-lite"

import {useEffect, useMemo, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import axios from "axios";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {BottomSheet, Button, ListItem, Text} from "@rneui/themed";
import {Image} from "expo-image";
import ReadMoreText from "../../utils/ReadMoreText";
import NoOpengraph from "../../error-screen/NoOpengraph";


type WithOpenGraphProps = {
  url: string
  children: any
}

function WithOpenGraph({url, children}: WithOpenGraphProps) {
  const {updateOpenGraph, openGraph} = useActivitypubStatusContext()
  const [BottomSheetVisible, setBottomSheetVisible] = useState(false)

  async function resolveOpenGraph() {
    setBottomSheetVisible(true)
    try {
      const res = await axios.get(url)
      ogs({html: res.data}).then((res) => {
        updateOpenGraph(res.result)
      }).catch((e) => {
        updateOpenGraph(null)
      })
    } catch (e) {
      updateOpenGraph(null)
    }
  }

  const domain = useMemo(() => {
    if (!openGraph) return ""
    try {
      let domain = (new URL(openGraph.ogUrl));
      return domain.hostname
    } catch (e) {
      return openGraph.ogUrl
    }
  }, [openGraph])
  return <>
    <BottomSheet isVisible={BottomSheetVisible} onBackdropPress={() => {
      setBottomSheetVisible(false)
    }}>
      <ListItem containerStyle={{
        backgroundColor: "#2C2C2C",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: "flex",
        flexDirection: "column"
      }}>
        <View>
          <View style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "row"
          }}>
            <View style={{flexGrow: 1}}></View>
            <Button type={"clear"} color={"white"}>Proceed</Button>
          </View>

          {openGraph ? <View style={{
            borderColor: "gray",
            borderRadius: 8,
            borderWidth: 1
          }}>
            {openGraph.ogImage?.length > 0 &&
                <View style={{height: 240, width: "100%"}}>
                    <Image source={openGraph.ogImage[0].url}
                           style={{
                             height: 240,
                             width: "100%",
                             borderTopLeftRadius: 8,
                             borderTopRightRadius: 8
                           }}/>
                </View>
            }
            <View style={{padding: 8}}>
              <Text style={{opacity: 0.3}}>{domain}</Text>
              <ReadMoreText text={openGraph.ogTitle} maxLines={1} bold/>
              <ReadMoreText text={openGraph.ogDescription} maxLines={2}/>
            </View>
          </View> : <NoOpengraph/>}
        </View>
      </ListItem>
    </BottomSheet>
    <TouchableOpacity onPress={resolveOpenGraph}>
      {children}
    </TouchableOpacity>
  </>
}

export default WithOpenGraph