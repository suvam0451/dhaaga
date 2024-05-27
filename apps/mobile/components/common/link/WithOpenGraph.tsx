import ogs from "open-graph-scraper-lite"

import {useEffect, useMemo, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import axios from "axios";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {BottomSheet, Button, ListItem, Text} from "@rneui/themed";
import {Image} from "expo-image";
import ReadMoreText from "../../utils/ReadMoreText";
import NoOpengraph from "../../error-screen/NoOpengraph";
import AppLoadingIndicator from "../../error-screen/AppLoadingIndicator";
import {getLinkPreview, getPreviewFromContent} from "link-preview-js";


type WithOpenGraphProps = {
  url: string
  children: any
}

function WithOpenGraph({url, children}: WithOpenGraphProps) {
  const {updateOpenGraph, openGraph} = useActivitypubStatusContext()
  const [BottomSheetVisible, setBottomSheetVisible] = useState(false)
  const [Loading, setLoading] = useState(false)

  async function resolveOpenGraph() {
    setBottomSheetVisible(true)
    setLoading(true)

    getLinkPreview(url).then((res) => {
      updateOpenGraph(res as any)
    }).catch((e) => {
      console.log("[ERROR]: ogs", e)
    }).finally(() => {
      setLoading(false)
    })
  }

  const domain = useMemo(() => {
    if (!openGraph) return ""
    try {
      let domain = (new URL(openGraph.url));
      return domain.hostname
    } catch (e) {
      return openGraph.url
    }
  }, [openGraph])
  return <>
    <BottomSheet isVisible={BottomSheetVisible} onBackdropPress={() => {
      setBottomSheetVisible(false)
    }}
                 containerStyle={{width: "100%"}}
    >
      {/*<View style={{width: "100%"}}/>*/}
      <ListItem containerStyle={{
        backgroundColor: "#2C2C2C",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: "flex",
        flexDirection: "column",
        width: "100%"
      }}
                style={{
                  width: "100%",
                  display: "flex"
                }}
      >
        <View style={{flex: 1, width: "100%", flexGrow: 1}}>
          <View style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "row"
          }}>
            <View style={{flexGrow: 1}}></View>
            <Button type={"clear"} color={"white"}>Proceed</Button>
          </View>

          {Loading && <AppLoadingIndicator text={"Loading Preview"}/>}
          {!Loading && !openGraph && <NoOpengraph/>}
          {!Loading && openGraph && <View style={{
            borderColor: "gray",
            borderRadius: 8,
            borderWidth: 1
          }}>
            {openGraph.images?.length > 0 &&
                <View style={{height: 240, width: "100%"}}>
                    <Image source={openGraph.images[0]}
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
                  <ReadMoreText text={openGraph.title} maxLines={1} bold/>
                  <ReadMoreText text={openGraph.description} maxLines={2}/>
              </View>
          </View>}
        </View>
      </ListItem>
    </BottomSheet>
    <TouchableOpacity onPress={resolveOpenGraph}>
      {children}
    </TouchableOpacity>
  </>
}

export default WithOpenGraph