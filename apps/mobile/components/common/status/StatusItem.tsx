import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  View,
  TouchableOpacity
} from "react-native";
import {Text} from "@rneui/themed"
import {StandardView} from "../../../styles/Containers";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {formatDistance, formatDistanceToNowStrict} from "date-fns";
import {useEffect, useMemo, useState} from "react";
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
import {
  ActivityPubUserAdapter
} from "@dhaaga/shared-abstraction-activitypub/src";
import {randomUUID} from "expo-crypto";
import {useRealm} from "@realm/react";
import WithActivitypubUserContext from "../../../states/useProfile";
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";

const POST_SPACING_VALUE = 4

type StatusItemProps = {
  // a list of color ribbons to indicate replies
  replyContextIndicators?: string[]
  hideReplyIndicator?: boolean
}

type StatusFragmentProps = {
  // status: mastodon.v1.Status | Note;
  mt?: number;
  isRepost?: boolean
} & StatusItemProps;

/**
 * This is the individual status component (without the re-blogger info)
 * @param status
 * @param mt
 * @constructor
 */
function RootStatusFragment({
  mt,
  isRepost,
}: StatusFragmentProps) {
  const navigation = useNavigation<any>();
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()

  const {status, statusRaw, sharedStatus} = useActivitypubStatusContext()
  const _status = isRepost ? sharedStatus : status

  const [PosterContent, setPosterContent] = useState(<View></View>);
  const [ExplanationObject, setExplanationObject] = useState<string | null>(null)

  const userI = useMemo(() => {
    return ActivityPubUserAdapter(_status?.getUser() || null, domain)
  }, [_status])

  useEffect(() => {
    const user = _status.getUser()
    setPosterContent(
        <WithActivitypubUserContext user={user}>
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
        </WithActivitypubUserContext>
    );
  }, [_status]);

  let content = _status.getContent();

  const xyz = useMemo(() => {
    if (!_status?.getContent() || !userI?.getInstanceUrl()) {
      return {aiContext: [], nodes: <View></View>}
    }

    const emojiMap = userI.getEmojiMap()
    const {openAiContext, reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain: accountState?.activeAccount?.domain,
      subdomain: accountState?.activeAccount?.subdomain,
      remoteSubdomain: userI.getInstanceUrl(),
      db, globalDb
    })

    return {
      aiContext: openAiContext,
      nodes: reactNodes?.map(
          (para) => {
            const uuid = randomUUID()
            return <Text key={uuid} style={{
              marginBottom: 8,
              display: "flex",
            }}
            >
              {para.map((o, j) => o)}
            </Text>
          }
      )
    }
  }, [_status?.getContent(), userI?.getInstanceUrl()])

  const [BottomSheetVisible, setBottomSheetVisible] = useState(false);

  function statusActionListClicked() {
    setBottomSheetVisible(!BottomSheetVisible)
  }

  return (
      <>
        <Status
            visible={BottomSheetVisible}
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
                  marginTop: mt === undefined ? 0 : mt,
                  marginBottom: 8,
                  position: "relative"
                }}
            >
              {PosterContent}
              {/*<View style={{position: "absolute", left: "100%"}}>*/}
              {/*<View style={{position: "relative"}}>*/}
              {/*<View style={{position: "absolute", left: -36, top: -16, overflow: "visible"}}>*/}
              {/*<TouchableOpacity onPress={statusActionListClicked}>*/}
              {/*<FontAwesome name="bookmark" size={32} color="#888" style={{opacity: 0.87}} />*/}
              {/*<MaterialIcons name="bookmark-add" size={36} color="#888"  style={{opacity: 0.6}} />*/}
              {/*<MaterialIcons name="bookmark-add" size={32}
                       color="#888" style={{opacity: 0.87}} />*/}
              {/*<Ionicons name="ellipsis-horizontal" size={24} color="#888"/>*/}
              {/*</TouchableOpacity>*/}
              {/*</View>*/}
              {/*</View>*/}
              {/*</View>*/}
            </View>
            <View style={{marginBottom: 0}}>
              {xyz.nodes}
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
                      <View style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        marginBottom: 4
                      }}>
                          <View style={{
                            display: "flex",
                            flexDirection: "row",
                            flexGrow: 1,
                            alignItems: "center"
                          }}>
                              <View>
                                  <Ionicons
                                      color={"#bb86fc"}
                                      name={"language-outline"}
                                      size={15}/>
                              </View>
                              <View>
                                  <Text style={{
                                    color: "#bb86fc",
                                  }}>
                                    {" JP -> EN"}
                                  </Text>
                              </View>
                          </View>
                          <View>
                              <Text style={{
                                color: "#ffffff38",
                                flex: 1,
                                textAlign: "right",
                                fontSize: 14
                              }}>Translated using OpenAI</Text>
                          </View>
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
            openAiContext={xyz.aiContext}
            setExplanationObject={setExplanationObject}
        />
      </>
  );
}

export function RootFragmentContainer({
  mt,
  isRepost,
  replyContextIndicators
}: StatusFragmentProps) {
  const replyIndicatorsPresent = replyContextIndicators?.length > 0

  return <View style={{
    padding: replyIndicatorsPresent ? 0 : 10,
    backgroundColor: "#1e1e1e",
    marginTop: mt == undefined ? 0 : mt,
    marginBottom: 4,
    borderRadius: 8,
  }}>
    {replyIndicatorsPresent ?
        <View style={{
          borderLeftWidth: 2,
          borderLeftColor: "red",
        }}>
          <View style={{
            paddingBottom: 4,
            padding: 10
          }}>
            <RootStatusFragment
                mt={mt} isRepost={isRepost}
                replyContextIndicators={replyContextIndicators}
            />
          </View>
        </View> :
        <View style={{
          paddingBottom: 4
        }}>
          <RootStatusFragment
              mt={mt} isRepost={isRepost}
              replyContextIndicators={replyContextIndicators}
          />
        </View>
    }
  </View>
}

/**
 * Adds parent thread's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 * @constructor
 */
function RepliedStatusFragment() {
  const {status: _status, statusRaw: status} = useActivitypubStatusContext()
  if (!_status.isValid()) return <View></View>;

  return <View
      style={{backgroundColor: "#1e1e1e", marginBottom: POST_SPACING_VALUE}}>
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
    <RootFragmentContainer mt={-8} isRepost={false}/>
  </View>
}

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 * @param boostedStatus
 * @constructor
 */
function SharedStatusFragment({
  boostedStatus,
}: StatusFragmentProps & {
  postedBy: mastodon.v1.Account;
  boostedStatus: mastodon.v1.Status | Note;
}) {
  const {status: _status, statusRaw: status} = useActivitypubStatusContext()

  if (!_status.isValid()) return <View></View>;

  return (
      <View style={{
        backgroundColor: "#1e1e1e",
        marginBottom: POST_SPACING_VALUE
      }}>
        <StandardView
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
        >
          <Ionicons color={"#888"} name={"rocket-outline"} size={12}/>
          <Text style={{
            color: "#888",
            fontWeight: "500",
            marginLeft: 4,
            fontFamily: "Montserrat-ExtraBold",
          }}>
            {_status.getDisplayName()}
          </Text>
          <Text style={{color: "gray", marginLeft: 2, marginRight: 2}}>•</Text>
          <View style={{marginTop: 2}}>
            <Text style={{
              color: "#888",
              fontSize: 12,
              fontFamily: "Inter-Bold",
              opacity: 0.6
            }}>
              {formatDistanceToNowStrict(new Date(boostedStatus.createdAt))}
            </Text>
          </View>
        </StandardView>
        <RootFragmentContainer mt={-8} isRepost={true}/>
      </View>
  );
}

/**
 * Renders a status/note
 * @constructor
 */
function StatusItem({
  replyContextIndicators,
  hideReplyIndicator
}: StatusItemProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {status: _status, statusRaw} = useActivitypubStatusContext()

  switch (accountState.activeAccount?.domain) {
    case "mastodon": {
      const _statusRaw = statusRaw as mastodon.v1.Status;
      if (_status && _status.isReposted() && !hideReplyIndicator) {
        return <SharedStatusFragment
            isRepost={true}
            postedBy={_statusRaw?.reblog?.account}
            boostedStatus={_statusRaw?.reblog}
        />
      }
      if (_status && _status.isReply() && !hideReplyIndicator) {
        return <RepliedStatusFragment/>
      }

      return <RootFragmentContainer
          replyContextIndicators={replyContextIndicators}/>
    }
    case "misskey": {
      if (_status && _status.isReposted() && !hideReplyIndicator) {
        const _status = statusRaw as Note;
        return <SharedStatusFragment
            postedBy={_status.renote.user as any}
            isRepost={true}
            boostedStatus={_status}
        />
      }
    }
  }

  return <RootFragmentContainer/>
}

export default StatusItem;
