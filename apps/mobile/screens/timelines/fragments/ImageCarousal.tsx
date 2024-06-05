import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Dimensions, View, Image, Text, Pressable} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {useEffect, useRef, useState} from "react";
import {ImageWrapper, ImageViewer} from "react-native-reanimated-viewer";
import React from "react";
import {
  MediaAttachmentInterface
} from "@dhaaga/shared-abstraction-activitypub/src";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {APP_FONT} from "../../../styles/AppTheme";
import {Dialog} from "@rneui/themed";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ImageCarousalProps = {
  attachments: MediaAttachmentInterface[];
};

const MEDIA_CONTAINER_MAX_HEIGHT = 540;
const MEDIA_CONTAINER_WIDTH = Dimensions.get("window").width - 20;

/**
 * The image component is rendered
 * by a third-party library
 * @param param0
 */
function TimelineImageWrapped({
  attachment,
  CalculatedHeight,
  index,
  viewerRef,
}: {
  attachment: mastodon.v1.MediaAttachment;
  CalculatedHeight: number;
  index: number;
  viewerRef: React.RefObject<any>;
}) {
  return (
      <ImageWrapper
          key={index}
          viewerRef={viewerRef}
          index={index}
          source={{
            uri: attachment.remoteUrl,
          }}
          style={{marginTop: 8}}
      >
        <Image
            source={{
              uri: attachment.previewUrl,
            }}
            style={{width: MEDIA_CONTAINER_WIDTH, height: CalculatedHeight}}
        />
      </ImageWrapper>
  );
}

function TimelineImageRendered({
  attachment,
  CalculatedHeight,
  altText
}: {
  attachment: MediaAttachmentInterface;
  CalculatedHeight: number;
  altText?: string
}) {
  const [AltTextBackdropVisible, setAltTextBackdropVisible] = useState(false)

  function altTextBackdropPressed() {
    setAltTextBackdropVisible(false)
  }

  function onAltTextClicked() {
    setAltTextBackdropVisible(true)
  }

  return (
      <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: MEDIA_CONTAINER_WIDTH,
            height: CalculatedHeight,
            position: "relative"
          }}
      >
        <Image
            style={{
              flex: 1,
              width: MEDIA_CONTAINER_WIDTH,
              borderRadius: 16,
            }}
            source={{uri: attachment.getPreviewUrl()}}
        />
        <Dialog
            isVisible={AltTextBackdropVisible}
            onBackdropPress={altTextBackdropPressed}
            overlayStyle={{backgroundColor: "#383838", borderRadius: 8}}
        >
          <View style={{
            display: "flex", width: "100%",  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            marginBottom: 4
          }}>
            <View>
              <Text
                  style={{color: APP_FONT.MONTSERRAT_BODY, fontFamily: "Inter-Bold", fontSize: 20}}>Alt Text
              </Text>
            </View>

            <View style={{padding: 8, marginRight: -8, marginTop: -12}}>
              <MaterialCommunityIcons name="text-to-speech" size={28} color={APP_FONT.MONTSERRAT_BODY} />
            </View>
          </View>

          <Text style={{
            color: APP_FONT.MONTSERRAT_BODY
          }}>{altText}</Text>
        </Dialog>

        {altText &&
            <View style={{
              position: "absolute",
              top: "100%",
              left: "0%",
              zIndex: 99
            }}
            >
                <View style={{position: "relative"}}>
                    <Pressable style={{
                      position: "absolute", top: -40, left: 8,
                      backgroundColor: "rgba(100, 100, 100, 0.87)",
                      padding: 4,
                      borderRadius: 8,
                    }} onPress={onAltTextClicked}>
                        <FontAwesome5 name="info-circle" size={24}
                                      color={APP_FONT.MONTSERRAT_BODY}/>
                    </Pressable>
                </View>
            </View>}
      </View>
  );
}

function ImageCarousal({attachments}: ImageCarousalProps) {
  const imageRef = useRef(null);

  const [CalculatedHeight, setCalculatedHeight] = useState(
      MEDIA_CONTAINER_MAX_HEIGHT
  );
  const [CarousalData, setCarousalData] = useState({
    index: 0,
    total: attachments?.length
  })

  function onCarousalItemChanged(e: any) {
    setCarousalData({
      index: e,
      total: attachments?.length
    })
  }

  useEffect(() => {
    if (!attachments) return
    let MIN_HEIGHT = 0;
    for (const item of attachments) {
      const meta = item.getMeta();

      const width = item.getWidth();
      const height = item.getHeight();

      if (height && height > MIN_HEIGHT) {
        const deviceWidth = Dimensions.get("window").width;
        const multiplier = deviceWidth / width;
        MIN_HEIGHT = Math.min(height * multiplier, MEDIA_CONTAINER_MAX_HEIGHT);
      }
    }
    setCalculatedHeight(MIN_HEIGHT);
  }, [attachments]);

  if (attachments?.length === 1) {
    return (
        <React.Fragment>
          <ImageViewer
              ref={imageRef}
              data={attachments.map((o) => ({
                source: {uri: o.getUrl()},
                key: o.getId(),
              }))}
          />
          <TimelineImageRendered
              attachment={attachments[0]}
              CalculatedHeight={CalculatedHeight}
              altText={attachments[0].getAltText()}
          />
        </React.Fragment>
    );
  }
  return (
      attachments?.length > 0 && (
          <View>
            <View style={{display: "flex", flexDirection: "row"}}>
              <View style={{flexGrow: 1}}/>
              <Text style={{
                color: "#fff",
                opacity: 0.6,
                fontSize: 16
              }}>
                {CarousalData.index + 1}/{CarousalData.total}
              </Text>
            </View>

            <Carousel
                width={Dimensions.get("window").width}
                height={CalculatedHeight}
                data={attachments}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                  onCarousalItemChanged(index)
                }}
                pagingEnabled={true}
                renderItem={(o) => (
                    <TimelineImageRendered
                        attachment={o.item}
                        CalculatedHeight={CalculatedHeight}
                    />
                )}
            />
          </View>
      )
  );
}

export default ImageCarousal;
