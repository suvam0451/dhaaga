import React, {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import {BottomSheet, Button, ListItem, Text} from "@rneui/themed";
import {TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {BottomSheetActionButtonContainer} from "../../styles/Containers";

type HashtagActionsProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}

function HashtagBottomSheet({visible, setVisible, id}: HashtagActionsProps) {
  const [Data, setData] = useState(null)

  const {client} = useActivityPubRestClientContext()

  async function api() {
    if (!client)
      return null

    return await client.getTag(id)
  }

  // Queries
  const {status, data, fetchStatus, refetch, isPlaceholderData} = useQuery<
      mastodon.v1.Tag | null
  >({
    queryKey: ["/tags", id],
    queryFn: api,
    enabled: client !== null && id !== null && visible,
  });

  const [AggregatedData, setAggregatedData] = useState({
    posts: 0,
    users: 0
  })

  useEffect(() => {
    if (fetchStatus !== "fetching") return
    setData(data)

    let totalAccounts = 0
    let totalPosts = 0
    for (let i = 0; i < data?.history.length; i++) {
      const historyItem = data?.history[i]
      totalAccounts += parseInt(historyItem.accounts)
      totalPosts += parseInt(historyItem.uses)
    }

    setAggregatedData({
      posts: totalPosts,
      users: totalAccounts
    })
  }, [fetchStatus]);


  async function onClickFollowTag() {
    if (!Data) return
    if (Data?.following) {
      const data = await client.unfollowTag(Data.name)
      setData(data)
    } else {
      const data = await client.followTag(Data.name)
      setData(data)
    }
  }

  return <BottomSheet isVisible={visible} onBackdropPress={() => {
    setVisible(false)
  }}>
    <ListItem containerStyle={{
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
              #{data?.name}</ListItem.Title>
            <Text>{AggregatedData.posts} posts
              from {AggregatedData.users} users</Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8
          }}>
            {Data?.following ?
                <Button
                    onPress={onClickFollowTag}>Follow</Button> :
                <Button
                    onPress={onClickFollowTag}
                    type="outline"
                    buttonStyle={{
                      borderColor: 'red',
                      backgroundColor: 'rgba(39, 39, 39, 1)',
                      // margin: 0,
                      // padding: 0
                    }}
                    containerStyle={{
                      // padding: 0,
                      // margin: 0
                    }}
                    titleStyle={{
                      color: 'white',
                      opacity: 0.87,
                    }}
                >Followed</Button>}
            <BottomSheetActionButtonContainer style={{marginLeft: 8}}>
              <Ionicons color={"white"} size={24} name={"globe-outline"}/>
            </BottomSheetActionButtonContainer>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  </BottomSheet>
}

export default HashtagBottomSheet