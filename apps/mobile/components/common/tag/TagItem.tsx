import {ScrollView, TouchableOpacity, View} from "react-native";
import {useActivitypubTagContext} from "../../../states/useTag";
import {Button, Skeleton, Text} from "@rneui/themed"
import React, {useEffect, useMemo, useState} from "react";
import InstanceService from "../../../services/instance.service";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useNavigation} from "@react-navigation/native";
import {APP_THEME} from "../../../styles/AppTheme";
import useLongLinkTextCollapse from "../../../states/useLongLinkTextCollapse";

function TagSkeleton() {
  return <View style={{
    width: "100%",
    height: 56,
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 8
  }}>
    <View style={{flexGrow: 1, height: 56}}>
      <Skeleton style={{height: 56, borderRadius: 8}}/>
    </View>
    <View style={{width: 72, marginLeft: 16, height: 56}}>
      <Skeleton style={{height: 56, borderRadius: 8}}/>
    </View>
  </View>
}

/**
 * Tag Item, as it appears on a Scrollable timeline-menu
 * @constructor
 */
function TagItem() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const subdomain = accountState?.activeAccount?.subdomain
  const navigation = useNavigation<any>()

  const {tag, setDataRaw} = useActivitypubTagContext()
  const {client} = useActivityPubRestClientContext()

  const [AggregatedData, setAggregatedData] = useState(null)

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

  const {Result} = useLongLinkTextCollapse(tag.getName(), 64)

  return useMemo(() => {
    if (!tag || !AggregatedData) return <TagSkeleton/>
    return <View style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 8,
      paddingHorizontal: 16,
      backgroundColor: "#121212",
      borderWidth: 1,
      maxWidth: "100%",
      marginBottom: 8
    }}>
      <TouchableOpacity onPress={onTagClick}>
        <View style={{flexShrink: 1, maxWidth: 250}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text>#{Result}</Text>
          </ScrollView>
          <Text
              style={{color: "#fff", opacity: 0.6}}>
            {AggregatedData.posts} posts
            from {AggregatedData.users} users
          </Text>
        </View>
      </TouchableOpacity>
      <View>
        {tag?.isFollowing() ?
            <Button
                onPress={onClickFollowTag}
                type="outline"
                buttonStyle={{
                  borderColor: APP_THEME.INVALID_ITEM,
                  backgroundColor: 'rgba(39, 39, 39, 1)',
                }}
                containerStyle={{}}
                titleStyle={{
                  color: 'white',
                  opacity: 0.87,
                }}
            >
              <Text style={{fontFamily: "Montserrat-Bold"}}>
                Followed
              </Text>
            </Button> : <Button
                onPress={onClickFollowTag}
                color={APP_THEME.INVALID_ITEM}
                size={"md"}
            >
              <Text style={{fontFamily: "Montserrat-Bold"}}>
                Follow
              </Text>
            </Button>}
      </View>
    </View>
  }, [tag, AggregatedData])
}

export default TagItem;