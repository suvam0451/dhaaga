import React, {useEffect, useState} from "react";
import {useActivitypubUserContext} from "../../states/useProfile";
import {BottomSheet, Text, ListItem, Button} from "@rneui/themed";
import {ScrollView, View} from "react-native";
import {Image} from "expo-image";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import MfmService from "../../services/mfm.service";
import {randomUUID} from "expo-crypto";
import {PrimaryText, SecondaryText} from "../../styles/Typography";
import {
  AvatarContainerWithInset,
  AvatarExpoImage
} from "../../styles/Containers";

type StatusActionsProps = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function UserActionSheet({visible, setVisible}: StatusActionsProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const subdomain = accountState?.activeAccount?.subdomain


  const {user} = useActivitypubUserContext()
  const desc = user.getDescription()
  const [DescriptionContent, setDescriptionContent] = useState(<></>)


  useEffect(() => {
    const mfmParseResult = MfmService.renderMfm(desc, {
      emojiMap: user.getEmojiMap(),
      domain: accountState?.activeAccount?.domain,
      subdomain: accountState?.activeAccount?.subdomain
    })
    setDescriptionContent(<>
      {mfmParseResult?.reactNodes?.map(
          (para) => {
            const uuid = randomUUID()
            return <Text key={uuid} style={{marginBottom: 0, opacity: 0.87}}>
              {para.map((o, j) => o)}
            </Text>
          }
      )}
    </>)
  }, [desc]);

  return <BottomSheet
      isVisible={visible}
      containerStyle={{padding: 0, borderTopLeftRadius: 16}}
      onBackdropPress={() => {
        setVisible(false)
      }}>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 0,
      paddingBottom: 32
    }}>
      <View style={{width: "100%", paddingTop: 0, position: "relative"}}>
        <View style={{
          position: "absolute",
          opacity: 0.6,
          zIndex: 99,
          left: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 6
        }}>
          <View style={{
            position: "absolute",
            backgroundColor: "#fff",
            // marginTop: 4,
            height: 2,
            width: 128,
            zIndex: 99,
            opacity: 1
          }}/>
        </View>
        <Image
            source={user.getBannerUrl()}
            style={{
              width: "100%",
              height: 128, borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}/>

        <View style={{display: "flex", flexDirection: "row"}}>
          <AvatarContainerWithInset>
            <AvatarExpoImage source={{uri: user.getAvatarUrl()}}/>
          </AvatarContainerWithInset>
          <View style={{flexGrow: 1}}></View>
          <View style={{display: "flex", flexDirection: "row", marginRight: 8}}>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{user.getPostCount()}</PrimaryText>
              <SecondaryText>Posts</SecondaryText>
            </View>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{user.getFollowingCount()}</PrimaryText>
              <SecondaryText>Following</SecondaryText>
            </View>
            <View
                style={{display: "flex", alignItems: "center", marginLeft: 8}}
            >
              <PrimaryText>{user.getFollowersCount()}</PrimaryText>
              <SecondaryText>Followers</SecondaryText>
            </View>
          </View>
        </View>
        <View style={{
          flexGrow: 1,
          marginLeft: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <View style={{flexGrow: 1}}>
            <Text style={{maxWidth: 128}}
                  numberOfLines={1}>{user.getDisplayName()}</Text>
            <Text style={{
              color: "#fff",
              opacity: 0.6,
            }}>{user.getAppDisplayAccountUrl(subdomain)}</Text>
          </View>
          <View style={{marginRight: 16}}>
            <Button type={"solid"} size={"sm"}>
              <Text>See Full Profile</Text>
            </Button>

          </View>
        </View>
        {/* Body*/}
        <ScrollView style={{maxHeight: 196}}>
          <View style={{paddingHorizontal: 8, marginTop: 16}}>
            {DescriptionContent}
          </View>
        </ScrollView>

      </View>
    </ListItem>
  </BottomSheet>
}

export default UserActionSheet