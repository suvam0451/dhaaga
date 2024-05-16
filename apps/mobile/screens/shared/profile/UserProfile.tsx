import React, {useEffect, useMemo, useRef, useState} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View,} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {
  ActivityPubAccount,
  ActivityPubClientFactory,
  ActivityPubStatuses,
  MastodonRestClient,
  MisskeyRestClient,
  UnknownRestClient,
} from "@dhaaga/shared-abstraction-activitypub/src";
import {useQuery} from "@tanstack/react-query";
import {adaptUserProfile} from "../../../utils/activitypub-adapters";
import {Image} from "expo-image";
import {
  AvatarContainerWithInset,
  AvatarExpoImage,
} from "../../../styles/Containers";
import {PrimaryText, SecondaryText} from "../../../styles/Typography";
import {Text} from "@rneui/themed";
import StatusFragment from "../../timelines/fragments/StatusFragment";
import UserPostsProvider, {UserPostsHook} from "../../../contexts/UserPosts";
import Ionicons from "@expo/vector-icons/Ionicons";
import RenderHTML from "react-native-render-html";
import UserProfileExtraInformation from "./ExtraInformation";
import TitleOnlyStackHeaderContainer
  from "../../../components/containers/TitleOnlyStackHeaderContainer";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import WithActivitypubStatusContext from "../../../states/useStatus";


type UserProfileBrowsePostsProps = {
  userId: string;
};

/**
 * Component to allow users to view images and posts of a user
 * @param param0
 * @returns
 */
function UserProfileBrowsePosts({userId}: UserProfileBrowsePostsProps) {
  const {store, dispatch} = UserPostsHook();
  const [RecentPostsCollapsed, setRecentPostsCollapsed] = useState(true);
  const {client} = useActivityPubRestClientContext()

  async function queryFnPosts() {
    return await client.getUserPosts(userId, {excludeReplies: true, limit: 5});
  }

  // Post Queries
  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubStatuses>({
        queryKey: ["profile/posts", client, userId],
        queryFn: queryFnPosts,
        enabled: userId !== undefined,
      });

  useEffect(() => {
    if (status === "success") {
      dispatch.setPosts(data);
    }
  }, [status, data]);

  return (
      <View>
        <View
            style={{
              margin: 6,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: "#222",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
        >
          <Text style={{color: "white", flexGrow: 1}}>Images</Text>
          <Ionicons name="chevron-forward" size={24} color="white"/>
        </View>
        <TouchableOpacity
            onPress={() => {
              setRecentPostsCollapsed(!RecentPostsCollapsed);
            }}
        >
          <View
              style={{
                margin: 6,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 16,
                paddingRight: 16,
                backgroundColor: "#222",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
          >
            <Text style={{color: "white", flexGrow: 1}}>Posts</Text>
            <Ionicons
                name={RecentPostsCollapsed ? "chevron-forward" : "chevron-down"}
                size={24}
                color="white"
            />
          </View>
        </TouchableOpacity>
        <View style={{display: RecentPostsCollapsed ? "none" : "flex"}}>
          {store.posts &&
              store.posts.map((o, i) =>
                  <WithActivitypubStatusContext status={o} key={i}>
                    <StatusFragment/>
                  </WithActivitypubStatusContext>)}
        </View>
      </View>
  );
}

function UserProfile({route, navigation}) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const q = route?.params?.id;
  const restClient = useRef<
      MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
  >(null);

  useEffect(() => {
    if (!accountState.activeAccount) {
      restClient.current = null;
      return;
    }

    const token = accountState.credentials.find(
        (o) => o.credential_type === "access_token"
    )?.credential_value;
    if (!token) {
      restClient.current = null;
      return;
    }

    const client = ActivityPubClientFactory.get(
        accountState.activeAccount.domain as any,
        {
          instance: accountState.activeAccount.subdomain,
          token,
        }
    );

    restClient.current = client;
  }, [accountState]);

  function queryFn() {
    const username = route?.params?.id;
    return restClient.current.getUserProfile(username);
  }

  // Queries
  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubAccount>({
        queryKey: ["profile", restClient.current, q],
        queryFn: queryFn,
        enabled: q !== undefined,
      });

  const _profile = useMemo(
      () => adaptUserProfile(data, accountState?.activeAccount?.domain),
      [status, accountState?.activeAccount?.domain]
  );

  if (!_profile) {
    return (
        <View>
          <Text>Not Found</Text>
        </View>
    );
  }

  const fields = _profile.getFields()
  const desc = _profile.getDescription()
  const avatarUrl = _profile.getAvatarUrl()
  const bannerUrl = _profile.getBannerUrl()

  return (
      <TitleOnlyStackHeaderContainer route={route} navigation={navigation}
                                     headerTitle={"Profile"}>
        <Image
            source={{uri: bannerUrl}}
            style={{height: 128, width: Dimensions.get("window").width}}
        />
        <View style={{display: "flex", flexDirection: "row"}}>
          <AvatarContainerWithInset>
            <AvatarExpoImage source={{uri: avatarUrl}}/>
          </AvatarContainerWithInset>
          <View style={{flexGrow: 1}}></View>
          <View style={{display: "flex", flexDirection: "row"}}>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{_profile.getPostCount()}</PrimaryText>
              <SecondaryText>Posts</SecondaryText>
            </View>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{_profile.getFollowingCount()}</PrimaryText>
              <SecondaryText>Following</SecondaryText>
            </View>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{_profile.getFollowersCount()}</PrimaryText>
              <SecondaryText>Followers</SecondaryText>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 8}}>
          <PrimaryText>{_profile.getDisplayName()}</PrimaryText>
          <SecondaryText>@{_profile.getUsername()}</SecondaryText>
        </View>
        <View style={{flex: 1, marginLeft: 8, marginRight: 8}}>
          {desc !== null ?
              <RenderHTML baseStyle={{color: "white", opacity: 0.87}}
                          source={{html: desc}}
                          contentWidth={Dimensions.get('window').width}
              /> : <View></View>}
        </View>

        {/*Separator*/}
        <View style={{flexGrow: 1}}/>

        <UserProfileExtraInformation fields={fields}/>
        <View style={{marginBottom: 16}}>
          <UserPostsProvider>
            <UserProfileBrowsePosts userId={_profile.getId()}/>
          </UserPostsProvider>
        </View>
      </TitleOnlyStackHeaderContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
})
export default UserProfile;
