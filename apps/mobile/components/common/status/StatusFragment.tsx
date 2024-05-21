import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {StandardView} from "../../../styles/Containers";
import {Ionicons} from "@expo/vector-icons";
import {formatDistance} from "date-fns";
import {useEffect, useState} from "react";
import {
  decodeHTMLString,
  parseStatusContent,
} from "@dhaaga/shared-utility-html-parser/src";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import OriginalPoster from "../../post-fragments/OriginalPoster";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import StatusInteraction
  from "../../../screens/timelines/fragments/StatusInteraction";
import ImageCarousal from "../../../screens/timelines/fragments/ImageCarousal";
import {useNavigation} from "@react-navigation/native";
import {useActivitypubStatusContext} from "../../../states/useStatus";
import MfmService from "../../../services/mfm.service";
import Status from "../../bottom-sheets/Status";

type StatusFragmentProps = {
  // status: mastodon.v1.Status | Note;
  mt?: number;
  isRepost?: boolean
};

/**
 * This is the individual status component (without the re-blogger info)
 * @param status
 * @param mt
 * @constructor
 */
function RootStatusFragment({mt, isRepost}: StatusFragmentProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {status, statusRaw, sharedStatus} = useActivitypubStatusContext()

  const _status = isRepost ? sharedStatus : status
  const navigation = useNavigation<any>();
  const [PosterContent, setPosterContent] = useState(<View></View>);
  const [ExplanationObject, setExplanationObject] = useState<string | null>(null)

  useEffect(() => {
    setPosterContent(
        <OriginalPoster
            id={_status.getAccountId_Poster()}
            avatarUrl={_status.getAvatarUrl()}
            displayName={_status.getDisplayName()}
            createdAt={_status.getCreatedAt()}
            username={_status.getUsername()}
            subdomain={accountState?.activeAccount?.subdomain}
            visibility={_status?.getVisibility()}
            accountUrl={_status.getAccountUrl()}
        />
    );
  }, [_status]);

  const [Content, setContent] = useState([]);
  const [OpenAiContext, setOpenAiContext] = useState([])

  useEffect(() => {
    let content = _status.getContent();

    let emojis = [];
    switch (accountState?.activeAccount?.domain) {
      case "mastodon": {
        emojis = (statusRaw as mastodon.v1.Status)?.emojis;
        break;
      }
      case "misskey": {
        // emojis = (status as Note).reactions
        break;
      }
      default: {
        break;
      }
    }

    const parsed = parseStatusContent(decodeHTMLString(content));

    let retval = [];
    let openAiContext = []
    let count = 0;
    for (const para of parsed) {
      for (const node of para) {
        const item = MfmService.parseNode(node, count.toString(), {
          emojis: statusRaw?.emojis || [] as any,
          domain: accountState?.activeAccount?.domain,
          subdomain: accountState?.activeAccount?.subdomain,
          isHighEmphasisText: false
        })
        if (node.type === "text") {
          const txt = node.props.text.trim()
          txt.replaceAll(/<br>/g, "\n");
          openAiContext.push(txt)
        }
        retval.push(item)
        count++;
      }
    }

    setOpenAiContext(openAiContext)
    setContent(retval);
  }, [_status]);

  const [BottomSheetVisible, setBottomSheetVisible] = useState(false);

  function statusActionListClicked() {
    setBottomSheetVisible(!BottomSheetVisible)
  }

  return (
      <StandardView style={{
        backgroundColor: "#1e1e1e", marginTop: mt == undefined ? 4 : 0,
        marginBottom: 4,
        borderRadius: 4,
        paddingBottom: 4
      }}>
        <Status visible={BottomSheetVisible}
                setVisible={setBottomSheetVisible}/>
        <TouchableOpacity delayPressIn={100} onPress={() => {
          navigation.navigate("Post", {
            id: status.getId()
          })
        }}>
          <View>
            <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: mt === undefined ? 16 : mt,
                  marginBottom: 8,
                }}
            >
              {PosterContent}
              <View>
                <TouchableOpacity onPress={statusActionListClicked}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#888"/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 16}}>
              <Text style={{color: "#fff", opacity: 0.87}}>{Content}</Text>

              {ExplanationObject !== null &&
                  <View style={{
                    backgroundColor: "#2E2E2E",
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    marginTop: 8,
                    borderRadius: 8
                  }}>
                      <View style={{display: "flex", flexDirection: "row"}}>
                          <Text style={{flex: 1, flexGrow: 1}}>
                              <Ionicons color={"#bb86fc"}
                                        name={"language-outline"} size={16}/>
                              <Text style={{
                                color: "#bb86fc",
                                marginLeft: 4,
                                paddingLeft: 4
                              }}>{" JP -> EN"}</Text>
                          </Text>
                          <Text style={{
                            color: "#ffffff38",
                            flex: 1,
                            textAlign: "right",
                            fontSize: 14
                          }}>Translated using
                              OpenAI</Text>
                      </View>

                      <Text
                          style={{color: "#ffffff87"}}>{ExplanationObject}</Text>
                  </View>}
            </View>
          </View>
        </TouchableOpacity>
        <ImageCarousal attachments={status?.getMediaAttachments()}/>
        <StatusInteraction
            post={status} statusId={statusRaw?.id}
            openAiContext={OpenAiContext}
            setExplanationObject={setExplanationObject}
        />
      </StandardView>
  );
}

function RepliedStatusFragment() {
  const {status: _status, statusRaw: status} = useActivitypubStatusContext()
  if (!_status.isValid()) return <View></View>;

  return <View
      style={{backgroundColor: "#1e1e1e"}}>
    <StandardView
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#1e1e1e"
        }}
    >
      <Ionicons color={"#888"} name={"arrow-redo-outline"} size={12}/>
      <Text style={{color: "#888", fontWeight: "500", marginLeft: 4}}>
        Continues a thread
      </Text>
    </StandardView>
    <RootStatusFragment mt={-16} isRepost={false}/>
  </View>
}

function SharedStatusFragment({
  boostedStatus,
}: StatusFragmentProps & {
  postedBy: mastodon.v1.Account;
  boostedStatus: mastodon.v1.Status | Note;
}) {
  const {status: _status, statusRaw: status} = useActivitypubStatusContext()

  if (!_status.isValid()) return <View></View>;

  return (
      <View style={{backgroundColor: "#1e1e1e"}}>
        <StandardView
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
        >
          <Ionicons color={"#888"} name={"rocket-outline"} size={12}/>
          <Text style={{color: "#888", fontWeight: "500", marginLeft: 4}}>
            {_status.getDisplayName()}
          </Text>
          <Text style={{color: "gray", marginLeft: 2, marginRight: 2}}>•</Text>
          <Text style={{color: "#888"}}>
            {formatDistance(new Date(boostedStatus.createdAt), new Date(), {
              addSuffix: true,
            })}
          </Text>
        </StandardView>

        <RootStatusFragment mt={-16} isRepost={true}/>
      </View>
  );
}

/**
 * Renders a status/note
 * @constructor
 */
function StatusFragment() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {status: _status, statusRaw} = useActivitypubStatusContext()

  switch (accountState.activeAccount?.domain) {
    case "mastodon": {
      const _statusRaw = statusRaw as mastodon.v1.Status;
      if (_status && _status.isReposted()) {
        return <SharedStatusFragment
            isRepost={true}
            postedBy={_statusRaw?.reblog?.account}
            boostedStatus={_statusRaw?.reblog}
        />
      }
      if (_status && _status.isReply()) {
        return <RepliedStatusFragment/>
      }
      return <RootStatusFragment/>
    }
    case "misskey": {
      if (_status && _status.isReposted()) {
        const _status = statusRaw as Note;
        return <SharedStatusFragment
            postedBy={_status.renote.user as any}
            isRepost={true}
            boostedStatus={_status}
        />
      }
    }
  }
  return <RootStatusFragment/>
}

export default StatusFragment;
