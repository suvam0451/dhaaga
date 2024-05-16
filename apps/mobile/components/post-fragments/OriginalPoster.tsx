import {View, Text} from "react-native";
import {Image} from "expo-image";
import {extractInstanceUrl, visibilityIcon} from "../../utils/instances";
import {formatDistance} from "date-fns";
import React, {useEffect, useState} from "react";
import {parseUsername} from "@dhaaga/shared-utility-html-parser/src";
import {parseNode} from "../../screens/timelines/fragments/util";
import {useSelector} from "react-redux";
import {RootState} from "../../libs/redux/store";
import {AccountState} from "../../libs/redux/slices/account";
import {useNavigation} from "@react-navigation/native";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {TouchableOpacity} from "react-native";

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
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    const nodes = parseUsername(displayName || "");
    let retval = [];
    let count = 0; //
    for (const node of nodes) {
      // @ts-ignore
      retval.push(
          parseNode(node, count.toString(), {
            emojis: [],
            domain: accountState?.activeAccount?.domain,
            subdomain: accountState?.activeAccount?.subdomain,
            isHighEmphasisText: true
          })
      );
      count++;
    }
    setUsernameWithEmojis(retval);
  }, [displayName]);

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
                }}
                source={{uri: avatarUrl}}
            />
          </View>
        </TouchableOpacity>
        <View style={{display: "flex", marginLeft: 8, flexGrow: 1}}>
          <TouchableOpacity onPress={onProfileClicked}>
            <Text style={{color: "white", opacity: 0.87, fontWeight: "600"}}>
              {UsernameWithEmojis}
            </Text>
          </TouchableOpacity>
          <Text style={{color: "#888", fontWeight: "500", fontSize: 12}}>
            {extractInstanceUrl(accountUrl, username, subdomain)}
          </Text>
          <View style={{display: "flex", flexDirection: "row"}}>
            <Text style={{color: "gray", fontSize: 12}}>
              {formatDistance(new Date(createdAt), new Date(), {
                addSuffix: true,
              })}
            </Text>
            <Text style={{color: "gray", marginLeft: 2, marginRight: 2}}>
              •
            </Text>
            {visibilityIcon(visibility)}
          </View>
        </View>
      </React.Fragment>
  );
}

export default OriginalPoster;
