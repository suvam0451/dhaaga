import React, {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import {BottomSheet, Button, ListItem, Skeleton, Text} from "@rneui/themed";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {Ionicons, FontAwesome} from "@expo/vector-icons";
import {BottomSheetActionButtonContainer} from "../../styles/Containers";
import WithActivitypubTagContext, {
  useActivitypubTagContext
} from "../../states/useTag";
import {TagType} from "@dhaaga/shared-abstraction-activitypub/src";
import {useNavigation} from "@react-navigation/native";
import InstanceService from "../../services/instance.service";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import {useActivitypubStatusContext} from "../../states/useStatus";

type HashtagActionsProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}

function Content() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const subdomain = accountState?.activeAccount?.subdomain
  const {status} = useActivitypubStatusContext()

  const {client} = useActivityPubRestClientContext()
  const {tag, setDataRaw} = useActivitypubTagContext()
  const navigation = useNavigation<any>();

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

  if (!tag || tag.getName() === "") return <Skeleton/>
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
          <ScrollView
              horizontal={true}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}>
            <ListItem.Title style={{color: "#fff", fontSize: 20}}>
              #{tag.getName()}
            </ListItem.Title>

          </ScrollView>
          <Text
              style={{color: "#fff", opacity: 0.6}}>{
            AggregatedData.posts} posts
            , {AggregatedData.users} users</Text>
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
      {/*<ListItem.Title>App</ListItem.Title>*/}
      <ListItem.Content>
        <View style={{
          backgroundColor: "#2C2C2C",
          display: "flex",
          flexDirection: "row"
        }}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => {
              navigation.navigate("Browse Hashtag", {
                q: tag.getName()
              })
            }}>
              <Button
                  type={"clear"}
                  style={{opacity: 0.6, marginRight: 2}}
                  buttonStyle={{
                    backgroundColor: "#333333",
                    borderRadius: 8,
                  }}
                  containerStyle={{
                    marginRight: 2
                  }}
              >
                <View>
                  <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <View>
                      <Text style={{
                        fontSize: 16,
                        color: "orange", opacity: 0.87
                      }}>
                        Your Instance
                        <Ionicons
                            color={"orange"}
                            style={{opacity: 0.6}} size={16}
                            name={"globe-outline"}/>
                      </Text>
                      <Text
                          style={{
                            fontSize: 12,
                            opacity: 0.6,
                            color: "orange"
                          }}>{subdomain}</Text>
                      <Text
                          style={{color: "#fff", opacity: 0.6, fontSize: 12}}>{
                        AggregatedData.posts} posts
                        by {AggregatedData.users} users</Text>
                    </View>
                  </View>
                </View>
              </Button>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, paddingLeft: 6}}>
            <Button
                type={"clear"}
                style={{opacity: 0.6}}
                buttonStyle={{backgroundColor: "#333333", borderRadius: 8}}
            >
              <View>
                <View style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <View>
                    <Text style={{
                      fontSize: 16, marginRight: 4,
                      color: "orange", opacity: 0.87
                    }}>
                      Their Instance
                      <FontAwesome
                          name={"external-link"} style={{opacity: 0.6}}
                          color={"orange"} size={16}/>
                    </Text>
                    <Text
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          color: "orange"
                        }}>https://misskey.io</Text>
                    <Text
                        style={{color: "#fff", opacity: 0.6, fontSize: 12}}>{
                      AggregatedData.posts} posts
                      by {AggregatedData.users} users</Text>
                  </View>
                </View>
              </View>
            </Button>
          </View>
        </View>

      </ListItem.Content>

    </ListItem>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
    }}>
      <View style={{flex: 1}}>
        <Button
            type={"outline"}
            buttonStyle={{
              backgroundColor: "#232323",
              borderColor: "#ffffff30"
            }}
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
      </View>
      <View style={{flex: 1}}>
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
            <Text style={{fontSize: 16, marginLeft: 4, color: "red"}}>
              Hide Locally</Text>
          </View>
        </Button>
      </View>
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