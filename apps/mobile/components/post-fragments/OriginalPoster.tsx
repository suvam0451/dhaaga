import {View, Text} from "react-native";
import {Image} from "expo-image";
import {extractInstanceUrl, visibilityIcon} from "../../utils/instances";
import {formatDistanceToNowStrict} from "date-fns";
import React, {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import MfmService from "../../services/mfm.service";
import {useActivitypubStatusContext} from "../../states/useStatus";
import {useActivitypubUserContext} from "../../states/useProfile";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../states/useGlobalMMkvCache";

type OriginalPosterProps = {
  id: string
  createdAt: string;
  avatarUrl: string;
  displayName: string;
  accountUrl: string;
  username: string;
  subdomain?: string;
  visibility: string;
};

function OriginalPoster({
  id,
  avatarUrl,
  createdAt,
  displayName,
  accountUrl,
  username,
  subdomain,
  visibility,
}: OriginalPosterProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const navigation = useNavigation<any>();
  const {status} = useActivitypubStatusContext()
  const {user, setDataRaw} = useActivitypubUserContext()
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()


  useEffect(() => {
    if (status.getUser()) return
    setDataRaw(status.getUser())
  }, [status]);

  const UsernameWithEmojis = useMemo(() => {
    const content = user?.getDisplayName()
    if (content === "") {
      return <View></View>
    }

    const emojiMap = user?.getEmojiMap()
    const {reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain: accountState?.activeAccount?.domain,
      subdomain: accountState?.activeAccount?.subdomain,
      remoteSubdomain: user.getInstanceUrl(),
      db, globalDb
    })
    return reactNodes
  }, [user?.getDisplayName()])

  function onProfileClicked() {
    navigation.navigate("Profile", {
      id: id,
    });
  }

  return (
      <React.Fragment>
        <TouchableOpacity onPress={onProfileClicked}>
          <View
              style={{
                width: 52,
                height: 52,
                borderColor: "gray",
                borderWidth: 2,
                borderRadius: 6,
              }}
          >
            <Image
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "#0553",
                  padding: 2,
                  opacity: 0.87,
                  borderRadius: 4
                }}
                source={{uri: avatarUrl}}
            />
          </View>
        </TouchableOpacity>
        <View style={{
          display: "flex",
          marginLeft: 8,
          flexGrow: 1,
          maxWidth: "100%"
        }}>
          <TouchableOpacity onPress={onProfileClicked}>
            <Text style={{
              color: "white",
              opacity: 0.6,
              fontFamily: "Montserrat-ExtraBold",
              maxWidth: 196,
            }} numberOfLines={1}>
              {UsernameWithEmojis}
            </Text>
          </TouchableOpacity>
          <Text style={{
            color: "#888",
            fontWeight: "500",
            fontSize: 12,
            opacity: 0.6,
            fontFamily: "Inter-Bold"
          }}>
            {extractInstanceUrl(accountUrl, username, subdomain)}
          </Text>
          <View style={{display: "flex", flexDirection: "row"}}>
            <Text style={{
              color: "gray",
              fontSize: 12,
              fontFamily: "Inter-Bold",
              opacity: 0.87
            }}>
              {formatDistanceToNowStrict(new Date(createdAt), {
                addSuffix: false,
              })}
            </Text>
            <Text style={{
              color: "gray",
              marginLeft: 2,
              marginRight: 2,
              opacity: 0.6
            }}>
              •
            </Text>
            {visibilityIcon(visibility)}
          </View>
        </View>
      </React.Fragment>
  );
}

export default OriginalPoster;
