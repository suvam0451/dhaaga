import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {StandardView} from "../../../styles/Containers";
import {Ionicons} from "@expo/vector-icons";
import {formatDistance, formatDistanceToNowStrict} from "date-fns";
import {useEffect, useState} from "react";
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
import {
  ActivityPubServerRepository
} from "../../../repositories/activitypub-server.repo";

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
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const {status, statusRaw, sharedStatus} = useActivitypubStatusContext()

  const realm = useRealm()

  useEffect(() => {
    const _user = ActivityPubUserAdapter(status.getUser(), domain)
    const acctUrl = _user.getAccountUrl()
    const ex = /^https?:\/\/(.*?)\/(.*?)/;
    if (ex.test(acctUrl)) {
      // @ts-ignore
      const theirUrl = acctUrl.match(ex)[1];
      // ActivityPubServerRepository.upsert(realm, theirUrl)
    }
  }, [status]);

  const _status = isRepost ? sharedStatus : status
  const navigation = useNavigation<any>();
  const [PosterContent, setPosterContent] = useState(<View></View>);
  const [ExplanationObject, setExplanationObject] = useState<string | null>(null)

  const [UserInterface, setUserInterface] = useState(ActivityPubUserAdapter(null, domain))
  const [DescriptionContent, setDescriptionContent] = useState(<></>)

  useEffect(() => {
    if (!_status) return
    setUserInterface(ActivityPubUserAdapter(_status.getUser(), domain))
  }, [_status]);

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

  const [OpenAiContext, setOpenAiContext] = useState([])

  let content = _status.getContent();
  useEffect(() => {
    const emojiMap = UserInterface.getEmojiMap()
    const {openAiContext, reactNodes} = MfmService.renderMfm(content, {
      emojiMap,
      domain: accountState?.activeAccount?.domain,
      subdomain: accountState?.activeAccount?.subdomain,
    })
    setDescriptionContent(<>
      {reactNodes?.map(
          (para, i) => {
            const uuid = randomUUID()
            return <Text key={uuid} style={{marginBottom: 8, opacity: 0.87}}>
              {para.map((o, j) => o)}
            </Text>
          }
      )}
    </>)
    setOpenAiContext(openAiContext)
  }, [content]);

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
                }}
            >
              {PosterContent}
              <View>
                <TouchableOpacity onPress={statusActionListClicked}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#888"/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginBottom: 0}}>
              {DescriptionContent}
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
                          <Text style={{
                            flex: 1,
                            flexGrow: 1,
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
            }}
        >
          <Ionicons color={"#888"} name={"rocket-outline"} size={12}/>
          <Text style={{color: "#888", fontWeight: "500", marginLeft: 4}}>
            {_status.getDisplayName()}
          </Text>
          <Text style={{color: "gray", marginLeft: 2, marginRight: 2}}>•</Text>
          <Text style={{color: "#888"}}>
            {formatDistanceToNowStrict(new Date(boostedStatus.createdAt))}
          </Text>
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
