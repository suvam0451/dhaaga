import React, {useEffect, useState} from "react";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import {View} from "react-native";
import {Text} from "@rneui/themed";

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
  } = useActivitypubStatusContext()

  const [RepliesCount, setRepliesCount] = useState(0);
  const [FavouritesCount, setFavouritesCount] = useState(0);
  const [RepostCount, setRepostCount] = useState(0);
  const [SeparatorDotCount, setSeparatorDotCount] = useState(0);

  const isBookmarked = post?.getIsBookmarked() || false

  useEffect(() => {
    if (!post) return
    setRepliesCount(post?.getRepliesCount());
    setFavouritesCount(post?.getFavouritesCount());
    setRepostCount(post?.getRepostsCount());

    let count = 0
    if (post?.getRepliesCount() > 0) count++
    if (post?.getFavouritesCount() > 0) count++
    if (post?.getRepostsCount()) count++

    setSeparatorDotCount(count)
  }, [post]);

  if (RepliesCount === 0 && FavouritesCount === 0 && RepostCount === 0)
    return <View></View>


  return <View style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 12,
  }}>
    <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
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
            {RepostCount} Shares
          </Text>
      </React.Fragment>}
    </View>
  </View>
}

export default PostStats