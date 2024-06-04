import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Text} from "@rneui/themed"
import {StatusInterface} from "@dhaaga/shared-abstraction-activitypub/src";
import {OpenAiService} from "../../../services/openai.service";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {Divider} from "@rneui/themed";
import PostStats from "../../../components/common/status/PostStats";
import * as Haptics from 'expo-haptics';

type StatusInteractionProps = {
  statusId: string;
  post: StatusInterface;
  setExplanationObject: React.Dispatch<React.SetStateAction<string | null>>
  openAiContext?: string[]
};

const ICON_SIZE = 18;

function StatusInteraction({
  openAiContext,
  setExplanationObject
}: StatusInteractionProps) {
  const [RepliesCount, setRepliesCount] = useState(0);
  const [FavouritesCount, setFavouritesCount] = useState(-1);
  const [RepostCount, setRepostCount] = useState(-1);
  const {client} = useActivityPubRestClientContext()
  const {
    status: post,
  } = useActivitypubStatusContext()


  const isBookmarked = post?.getIsBookmarked() || false

  useEffect(() => {
    if (!post) return
    setRepliesCount(post?.getRepliesCount());
    setFavouritesCount(post?.getFavouritesCount());
    setRepostCount(post?.getRepostsCount());
  }, [post]);

  function onTranslationLongPress() {
    console.log("translation long pressed")
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    OpenAiService.explain(openAiContext.join(",")).then((res) => {
      setExplanationObject(res)
    })
  }

  function OnTranslationClicked() {
    console.log("translation short pressed")
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
      <View style={{
        paddingHorizontal: 4
      }}>
        <PostStats/>
        <Divider color={"#cccccc"}
                 style={{opacity: 0.3, marginTop: 8, marginBottom: 4}}/>
        <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 0,
              marginTop: 8,
            }}
        >
          <View style={{display: "flex", "flexDirection": "row"}}>
            <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12
                }}
            >
              <FontAwesome5 name="comment" size={ICON_SIZE} color="#888"/>
              <Text style={{
                color: "#888",
                marginLeft: 8,
                fontFamily: "Montserrat-Bold"
              }}>Reply</Text>
            </View>
            <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12
                }}
            >
              <Ionicons color={"#888"} name={"rocket-outline"}
                        size={ICON_SIZE}/>
              {/*<Text style={{color: "#888", marginLeft: 4, fontSize: 16}}>*/}
              {/*  {RepostCount}*/}
              {/*</Text>*/}
              <Text style={{
                color: "#888",
                marginLeft: 8,
                fontFamily: "Montserrat-Bold"
              }}>Boost</Text>

            </View>
            <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8
                }}
            >
              <Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE}/>
              {FavouritesCount !== -1 && (
                  <>
                    {/*<Text style={{color: "#888", marginLeft: 4, fontSize: 16}}>*/}
                    {/*  {FavouritesCount}*/}
                    {/*</Text>*/}
                    <Text style={{
                      color: "#888",
                      marginLeft: 8,
                      fontFamily: "Montserrat-Bold"
                    }}>Star</Text>
                  </>
              )}
            </View>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <TouchableOpacity
                style={{marginRight: 20}}
                onPress={OnTranslationClicked}
                onLongPress={onTranslationLongPress}
            >
              <Ionicons color={"#888"} name={"language-outline"}
                        size={ICON_SIZE + 8}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={ICON_SIZE + 8}
                        color="#888"/>
            </TouchableOpacity>
          </View>
          {/*<TouchableOpacity onPress={toggleBookmark}>*/}
          {/*  <Ionicons color={isBookmarked ? "purple" : "#888"}*/}
          {/*            name={isBookmarked ? "bookmark" : "bookmark-outline"}*/}
          {/*            size={ICON_SIZE}/>*/}
          {/*</TouchableOpacity>*/}
        </View>
      </View>
  );
}

export default StatusInteraction;
