import React, {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import {BottomSheet, Button, ListItem, Skeleton, Text} from "@rneui/themed";
import {TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {BottomSheetActionButtonContainer} from "../../styles/Containers";
import WithActivitypubTagContext, {
  useActivitypubTagContext
} from "../../states/useTag";
import {TagType} from "@dhaaga/shared-abstraction-activitypub/src";
import {useNavigation} from "@react-navigation/native";

type HashtagActionsProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}

function Content() {
  const {client} = useActivityPubRestClientContext()
  const {tag, setDataRaw} = useActivitypubTagContext()
  const navigation = useNavigation<any>();

  const [AggregatedData, setAggregatedData] = useState({
    posts: 0,
    users: 0
  })

  useEffect(() => {
    if (!tag) return
    let totalAccounts = 0
    let totalPosts = 0
    const history = tag.getHistory()
    if (!history) return
    for (let i = 0; i < history.length; i++) {
      const historyItem = history[i]
      totalAccounts += parseInt(historyItem.accounts)
      totalPosts += parseInt(historyItem.uses)
    }

    setAggregatedData({
      posts: totalPosts,
      users: totalAccounts
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

  if (!tag) return <Skeleton/>
  return <><ListItem containerStyle={{
    backgroundColor: "#2C2C2C",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  }}>
    <ListItem.Content style={{width: "100%"}}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <View style={{flex: 1, flexGrow: 1}}>
          <ListItem.Title style={{color: "#fff", fontSize: 24}}>
            #{tag.getName()}</ListItem.Title>
          <Text>{AggregatedData.posts} posts
            from {AggregatedData.users} users</Text>
        </View>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 8
        }}>
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
          <BottomSheetActionButtonContainer style={{marginLeft: 8}}>
            <TouchableOpacity onPress={() => {
              navigation.navigate("Browse Hashtag", {
                q: tag.getName()
              })
            }}>
              <Ionicons color={"white"} size={24} name={"globe-outline"}/>
            </TouchableOpacity>

          </BottomSheetActionButtonContainer>
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C",
    }}>
      <Button
          type={"outline"}
          buttonStyle={{backgroundColor: "#232323", borderColor: "#ffffff30"}}
          containerStyle={{borderColor: "purple"}}
          style={{opacity: 0.6}}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <View>
            <Ionicons name={"add-outline"} color={"#fff"} size={24}/>
          </View>
          <Text style={{fontSize: 16}}>Add to Timeline</Text>
        </View>
      </Button>
      <Button
          type={"clear"}
          style={{opacity: 0.6}}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <View style={{marginRight: 4}}>
            <Ionicons name={"eye-off-outline"} color={"red"} size={24}/>
          </View>
          <Text style={{fontSize: 16, marginLeft: 4, color: "red"}}>Hide
            Locally</Text>
        </View>
      </Button>
    </ListItem>
  </>
}

function HashtagBottomSheet({visible, setVisible, id}: HashtagActionsProps) {
  const [Data, setData] = useState(null)

  const {client} = useActivityPubRestClientContext()

  async function api() {
    if (!client) return null
    return await client.getTag(id)
  }

  // Queries
  const {status, data, fetchStatus} = useQuery<
      TagType | null
  >({
    queryKey: ["/tags", id],
    queryFn: api,
    enabled: client !== null && id !== null && visible,
  });

  useEffect(() => {
    if (status !== "success" || !data) return
    setData(data)
  }, [data, status]);

  return <BottomSheet isVisible={visible} onBackdropPress={() => {
    setVisible(false)
  }}>
    <WithActivitypubTagContext tag={Data}>
      <Content/>
    </WithActivitypubTagContext>
  </BottomSheet>
}

export default HashtagBottomSheet