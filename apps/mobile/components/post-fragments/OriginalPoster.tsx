import {View, Text} from "react-native";
import {Image} from "expo-image";
import {extractInstanceUrl, visibilityIcon} from "../../utils/instances";
import {formatDistanceToNowStrict} from "date-fns";
import React, {useEffect, useState} from "react";
import {parseUsername} from "@dhaaga/shared-utility-html-parser/src";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import MfmService from "../../services/mfm.service";
import {useActivitypubStatusContext} from "../../states/useStatus";
import activitypubAdapterService
  from "../../services/activitypub-adapter.service";
import {useActivitypubUserContext} from "../../states/useProfile";

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
  const [UsernameWithEmojis, setUsernameWithEmojis] = useState<JSX.Element[]>(
      []
  );
  const navigation = useNavigation<any>();
  const {status} = useActivitypubStatusContext()
  const {user, setDataRaw} = useActivitypubUserContext()

  useEffect(() => {
    if (status.getUser()) return
    setDataRaw(status.getUser())
  }, [status]);

  useEffect(() => {
    const nodes = parseUsername(displayName || "");
    let retval = [];
    let count = 0; //
    const emojiMap = user?.getEmojiMap()

    for (const node of nodes) {
      // @ts-ignore
      retval.push(
          MfmService.parseNode(node, count.toString(), {
            emojiMap: emojiMap || new Map(),
            domain: accountState?.activeAccount?.domain,
            subdomain: accountState?.activeAccount?.subdomain,
            isHighEmphasisText: true
          })
      );
      count++;
    }
    setUsernameWithEmojis(retval);
  }, [user]);

  function onProfileClicked() {
    navigation.navigate("Profile", {
      id: id,
    });
    // showActionSheetWithOptions(
    //     STATUS_USER_PROFILE_CLICK_ACTION_SHEET_OPTIONS,
    //     (selectedIndex: number) => {
    //       switch (selectedIndex) {
    //         case 0: {
    //           navigation.navigate("Profile", {
    //             id: id,
    //           });
    //           break;
    //         }
    //         default: {
    //           break;
    //         }
    //       }
    //     }
    // );
  }

  return (
      <React.Fragment>
        <TouchableOpacity onPress={onProfileClicked}>
          <View
              style={{
                width: 52,
                height: 52,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 4,
              }}
          >
            <Image
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "#0553",
                  padding: 2,
                  opacity: 0.87
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
