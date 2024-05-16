import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  View,
  Text,
  TouchableWithoutFeedback
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
import {parseNode} from "./util";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import OriginalPoster from "../../../components/post-fragments/OriginalPoster";
import {Note, UserLite} from "@dhaaga/shared-provider-misskey/src";
import StatusInteraction from "./StatusInteraction";
import ImageCarousal from "./ImageCarousal";
import {useNavigation} from "@react-navigation/native";
import {useActivitypubStatusContext} from "../../../states/useStatus";

type StatusFragmentProps = {
  status: mastodon.v1.Status | Note;
  mt?: number;
};

/**
 * This is the individual status component (without the re-blogger info)
 * @param status
 * @param mt
 * @constructor
 */
function RootStatusFragment({mt}: StatusFragmentProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {status, statusRaw} = useActivitypubStatusContext()

  const navigation = useNavigation<any>();
  const [PosterContent, setPosterContent] = useState(<View></View>);
  const [ExplanationObject, setExplanationObject] = useState<string | null>(null)

  useEffect(() => {
    setPosterContent(
        <OriginalPoster
            id={status.getAccountId_Poster()}
            avatarUrl={status.getAvatarUrl()}
            displayName={status.getDisplayName()}
            createdAt={status.getCreatedAt()}
            username={status.getUsername()}
            subdomain={accountState?.activeAccount?.subdomain}
            visibility={status?.getVisibility()}
            accountUrl={status.getAccountUrl()}
        />
    );
  }, [status]);

  const [Content, setContent] = useState([]);
  const [OpenAiContext, setOpenAiContext] = useState([])

  useEffect(() => {
    let content = status.getContent();

    let emojis = [];
    switch (accountState?.activeAccount?.domain) {
      case "mastodon": {
        emojis = (statusRaw as mastodon.v1.Status).emojis;
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
    let count = 0; //
    for (const para of parsed) {
      for (const node of para) {
        const item = parseNode(node, count.toString(), {
          emojis: statusRaw?.emojis || [],
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
  }, [status]);

  return (
      <StandardView style={{
        backgroundColor: "#1e1e1e", marginTop: mt == undefined ? 4 : 0,
        marginBottom: 4,
        borderRadius: 4,
        paddingBottom: 4
      }}>
        <TouchableWithoutFeedback onPress={() => {
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
                <Ionicons name="ellipsis-horizontal" size={24} color="#888"/>
              </View>
            </View>
            <View style={{marginBottom: 16}}>
              <View>{Content}</View>

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
        </TouchableWithoutFeedback>
        <ImageCarousal attachments={status?.getMediaAttachments()}/>
        <StatusInteraction
            post={status} statusId={statusRaw?.id}
            openAiContext={OpenAiContext}
            setExplanationObject={setExplanationObject}
        />
      </StandardView>
  );
}

function SharedStatusFragment({
  boostedStatus,
}: StatusFragmentProps & {
  postedBy: mastodon.v1.Account | UserLite;
  boostedStatus: mastodon.v1.Status | Note;
}) {
  const {status: _status, statusRaw: status} = useActivitypubStatusContext()

  if (!_status.isValid()) return <View></View>;

  return (
      <View style={{backgroundColor: "#1e1e1e", marginTop: 2, marginBottom: 2}}>
        <StandardView
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
        >
          <Ionicons color={"#888"} name={"rocket-outline"} size={12}/>
          <Text style={{color: "#888", fontWeight: "500", marginLeft: 4}}>
            {_status.getUsername()}
          </Text>
          <Text style={{color: "gray", marginLeft: 2, marginRight: 2}}>•</Text>
          <Text style={{color: "#888"}}>
            {formatDistance(new Date(boostedStatus.createdAt), new Date(), {
              addSuffix: true,
            })}
          </Text>
        </StandardView>
        <RootStatusFragment status={status} mt={4} key={0}/>
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
        return (
            <SharedStatusFragment
                status={_statusRaw?.reblog}
                postedBy={_statusRaw?.reblog?.account}
                boostedStatus={_statusRaw}
            />
        );
      }
      return <RootStatusFragment status={statusRaw}/>;
    }
    case "misskey": {
      if (_status && _status.isReposted()) {
        const _status = statusRaw as Note;
        return (
            <SharedStatusFragment
                status={_status.renote}
                postedBy={_status.renote.user}
                boostedStatus={_status}
            />
        );
      }
    }
  }
  return <RootStatusFragment status={statusRaw}/>;
}

export default StatusFragment;
