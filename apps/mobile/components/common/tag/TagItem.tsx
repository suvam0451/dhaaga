import {ScrollView, TouchableOpacity, View} from "react-native";
import {useActivitypubTagContext} from "../../../states/useTag";
import {Button, Text} from "@rneui/themed"
import React, {useEffect, useState} from "react";
import InstanceService from "../../../services/instance.service";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useNavigation} from "@react-navigation/native";

/**
 * Tag Item, as it appears on a Scrollable timeline
 * @constructor
 */
function TagItem() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const subdomain = accountState?.activeAccount?.subdomain
  const navigation = useNavigation<any>()

  const {tag, setDataRaw} = useActivitypubTagContext()
  const {client} = useActivityPubRestClientContext()

  const [AggregatedData, setAggregatedData] = useState({
    posts: 0,
    users: 0
  })

  useEffect(() => {
    if (!tag) return

    InstanceService.getTagInfoCrossDomain(tag, subdomain).then((res) => {
      setAggregatedData({
        users: res.common.users,
        posts: res.common.posts
      })
    }).catch((e) => {
      console.log("[ERROR]:", e)
    })
  }, [tag]);

  async function onClickFollowTag() {
    if (!tag) return
    if (tag?.isFollowing()) {
      const data = await client.unfollowTag(tag.getName())
      setDataRaw(data)
    } else {
      const data = await client.followTag(tag.getName())
      setDataRaw(data)
    }
  }

  function onTagClick() {
    navigation.push("Browse Hashtag", {q: tag.getName()})
  }

  return <View style={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: "#121212",
    borderWidth: 1,
  }}>
    <TouchableOpacity onPress={onTagClick}>
      <View style={{flexShrink: 1}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text>#{tag.getName()}</Text>
        </ScrollView>
        <Text
            style={{color: "#fff", opacity: 0.6}}>
          {AggregatedData.posts} posts
          from {AggregatedData.users} users
        </Text>
      </View>
    </TouchableOpacity>

    {tag?.isFollowing() ?
        <Button
            onPress={onClickFollowTag}
            type="outline"
            buttonStyle={{
              borderColor: 'red',
              backgroundColor: 'rgba(39, 39, 39, 1)',
            }}
            containerStyle={{}}
            titleStyle={{
              color: 'white',
              opacity: 0.87,
            }}
        >Followed</Button> : <Button
            onPress={onClickFollowTag}>Follow</Button>}
  </View>
}

export default TagItem;