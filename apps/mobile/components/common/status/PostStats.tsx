import React, {useEffect, useState} from "react";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {TouchableOpacity, View} from "react-native";
import {Text} from "@rneui/themed";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {APP_THEME} from "../../../styles/AppTheme";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import * as Haptics from 'expo-haptics';

/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
function PostStats() {
  const {
    status: post,
    setDataRaw
  } = useActivitypubStatusContext()

  const {client} = useActivityPubRestClientContext()
  const [RepliesCount, setRepliesCount] = useState(0);
  const [FavouritesCount, setFavouritesCount] = useState(0);
  const [RepostCount, setRepostCount] = useState(0);
  const [IsFavourited, setIsFavourited] = useState(false)
  const [SeparatorDotCount, setSeparatorDotCount] = useState(0);

  useEffect(() => {
    if (!post) return
    setRepliesCount(post?.getRepliesCount());
    setFavouritesCount(post?.getFavouritesCount());
    setRepostCount(post?.getRepostsCount());
    setIsFavourited(post?.getIsFavourited())

    let count = 0
    if (post?.getIsFavourited()) count++
    if (post?.getRepliesCount() > 0) count++
    if (post?.getFavouritesCount() > 0) count++
    if (post?.getRepostsCount()) count++

    setSeparatorDotCount(count)
  }, [post]);

  function onFavouriteClick() {
    if (IsFavourited) {
      client.unFavourite(post?.getId()).then((res) => {
        setDataRaw(res)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      })
    } else {
      client.favourite(post?.getId()).then((res) => {
        setDataRaw(res)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      })
    }
  }

  if (RepliesCount === 0 && FavouritesCount === 0 && RepostCount === 0)
    return <View></View>

  return <View style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 12,
  }}>
    <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      {FavouritesCount > 0 &&
          <TouchableOpacity onPress={onFavouriteClick} style={{
            display: "flex", flexDirection: "row", alignItems: "center"
          }}>
              <FontAwesome
                  name="star" size={18}
                  color={IsFavourited ? APP_THEME.LINK : "#ffffff87"}/>
              <Text style={{
                color: IsFavourited ? APP_THEME.LINK : "#888",
                fontSize: 12,
                marginLeft: 2,
              }}>{FavouritesCount}</Text>
          </TouchableOpacity>}
      <View style={{flexGrow: 1}}></View>
      {RepliesCount > 0 && <React.Fragment>
          <Text style={{
            color: "#888",
            marginLeft: 4,
            fontSize: 12,
            textAlign: "right"
          }}>
            {RepliesCount} Replies
          </Text>
          <Text
              style={{color: "#888", marginLeft: 2, opacity: 0.3}}>&bull;</Text>
      </React.Fragment>}
      {RepostCount > 0 && <React.Fragment>
          <Text style={{
            color: "#888",
            fontSize: 12,
            marginLeft: 2,
            textAlign: "right"
          }}>
            {RepostCount} Boosts
          </Text>
      </React.Fragment>}
    </View>
  </View>
}

export default PostStats