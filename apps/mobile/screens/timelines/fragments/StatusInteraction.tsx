import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {StatusInterface} from "@dhaaga/shared-abstraction-activitypub/src";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {OpenAiService} from "../../../service/openai.service";
import {
  POST_TRANSLATION_ACTION_SHEET_OPTIONS
} from "../../../services/action-sheet.service";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useActivitypubStatusContext} from "../../../states/useStatus";

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
  const {showActionSheetWithOptions} = useActionSheet();
  const {client} = useActivityPubRestClientContext()
  const {status: post, statusRaw, setDataRaw, toggleBookmark} = useActivitypubStatusContext()


  const isBookmarked = post?.getIsBookmarked() || false

  useEffect(() => {
    if (!post) return
    setRepliesCount(post?.getRepliesCount());
    setFavouritesCount(post?.getFavouritesCount());
    setRepostCount(post?.getRepostsCount());
  }, [post]);

  function OnTranslationClicked() {
    showActionSheetWithOptions(
        POST_TRANSLATION_ACTION_SHEET_OPTIONS,
        (selectedIndex: number) => {
          switch (selectedIndex) {
            case 0: {
              break;
            }
            case 1: {
              OpenAiService.explain(openAiContext.join(",")).then((res) => {
                setExplanationObject(res)
              })
              break
            }
            default: {
              break;
            }
          }
        }
    );
  }

  return (
      <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: 8,
            marginTop: 12,
          }}
      >
        <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
        >
          <Ionicons color={"#888"} name={"arrow-undo-outline"}
                    size={ICON_SIZE}/>
          <Text style={{color: "#888", marginLeft: 4, fontSize: 16}}>
            {post?.getRepliesCount()}
          </Text>
        </View>

        <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
        >
          <Ionicons color={"#888"} name={"rocket-outline"} size={ICON_SIZE}/>
          <Text style={{color: "#888", marginLeft: 4, fontSize: 16}}>
            {RepostCount}
          </Text>
        </View>
        <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
        >
          <Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE}/>
          {FavouritesCount !== -1 && (
              <Text style={{color: "#888", marginLeft: 4, fontSize: 16}}>
                {FavouritesCount}
              </Text>
          )}
        </View>
        <TouchableOpacity onPress={toggleBookmark}>
          <Ionicons color={isBookmarked ? "purple" : "#888"}
                    name={isBookmarked ? "bookmark": "bookmark-outline"} size={ICON_SIZE}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={OnTranslationClicked}>
          <Ionicons color={"#888"} name={"language-outline"} size={ICON_SIZE}/>
        </TouchableOpacity>
      </View>
  );
}

export default StatusInteraction;
