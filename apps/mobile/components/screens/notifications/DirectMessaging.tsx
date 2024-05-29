import {useNavigation, useRoute} from "@react-navigation/native";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../states/usePagination";
import TitleOnlyStackHeaderContainer
  from "../../containers/TitleOnlyStackHeaderContainer";
import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useEffect} from "react";
import ConversationListItem from "./fragments/dm/ConversationListItem";
import {
  ActivitypubStatusAdapter,
  ActivityPubUserAdapter, StatusInterface
} from "@dhaaga/shared-abstraction-activitypub/src";
import {useSelector} from "react-redux";
import {RootState} from "../../../libs/redux/store";
import {AccountState} from "../../../libs/redux/slices/account";
import {View} from "react-native";
import {
  ActivityPubServerRepository
} from "../../../repositories/activitypub-server.repo";
import {useQuery as useRealmQuery} from "@realm/react"
import {
  ActivityPubStatusRepository
} from "../../../repositories/activitypub-status.repo";
import {useRealm} from "@realm/react";
import {
  ActivityPubUserRepository
} from "../../../repositories/activitypub-user.repo";
import {
  ActivityPubConversation
} from "../../../entities/activitypub-conversation.entity";
import {
  ActivityPubConversationRepository
} from "../../../repositories/activitypub-conversation.repo";
import CryptoService from "../../../services/crypto.service";
import {
  ActivityPubChatRoom
} from "../../../entities/activitypub-chatroom.entity";
import {ENTITY} from "../../../entities/_entities";
import {
  ActivityPubChatroomRepository
} from "../../../repositories/activitypub-chatroom.repo";


function WithApi() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const _domain = accountState?.activeAccount?.domain
  const _subdomain = accountState?.activeAccount?.subdomain
  const {client} = useActivityPubRestClientContext()
  const {me, meRaw} = useActivityPubRestClientContext()
  const navigation = useNavigation()
  const route = useRoute<any>()
  const {
    data: PageData,
    updateQueryCache,
    append
  } = useAppPaginationContext()
  const db = useRealm()

  async function api() {
    if (!client) {
      return []
    }
    const data: mastodon.v1.Conversation[] = await client.getMyConversations()
    return data
  }

  // Queries
  const {status, data, refetch, fetchStatus} = useQuery<
      mastodon.v1.Conversation[] | Note[]
  >({
    queryKey: ["conversations"],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (fetchStatus === "fetching") return
    if (status !== "success") return
    append(data, (o: mastodon.v1.Conversation) => o.id)
  }, [fetchStatus]);

  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
  }

  async function populateChatrooms() {
    if(!me) return


    for await (const _item of PageData) {
      const item: mastodon.v1.Conversation = _item
      const participantIds = [...new Set(item.accounts.map((o) =>
          ActivityPubUserAdapter(o, _domain).getId()))]
          .sort((a, b) => a.localeCompare(b))
      // User is also a participant
      const myId = me.getId()
      if (!participantIds.includes(myId)) {
        participantIds.push(myId)
        item.accounts.push(meRaw)
      }
      const hash = await CryptoService.hashUserList(participantIds)
      const latestStatus = ActivitypubStatusAdapter(item.lastStatus, _domain)


      /**
       * Save data to Realm
       */
      for (let i = 0; i < item.accounts.length; i++) {
        ActivityPubStatusRepository.upsert(db,
            {
              status: latestStatus,
              domain: _domain,
              subdomain: _subdomain
            })
        ActivityPubConversationRepository.add(db,
            {
              me,
              conversation: item,
              hash,
              subdomain: _subdomain,
              domain: _domain
            })
      }
    }
  }

  useEffect(() => {
    populateChatrooms()
  }, [PageData]);

  async function onRefresh() {
    // refetch()
    const items = db.objects(ActivityPubConversation)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const chatrooms = item.linkingObjects<ActivityPubChatRoom>(
          ENTITY.ACTIVITYPUB_CHATROOM,
          "conversations"
      )

      if (chatrooms.length === 1) {
        console.log("users in conversation",
            item.conversationId,
            chatrooms[0].participants.map((o) => o.username))
      } else {
        console.log("cannot have multiple chatrooms", chatrooms.map((o) => o.hash))
      }
    }

    const chatrooms = db.objects(ActivityPubChatRoom)

    console.log(chatrooms.map((o) => o.conversations.map((o) => o.conversationId)))
  }

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`My Conversations`}
      onScrollViewEndReachedCallback={onScrollEndReach}
      onRefresh={onRefresh}
  >
    <View style={{paddingVertical: 8, paddingHorizontal: 8}}>{
      PageData.map((o: mastodon.v1.Conversation, i) =>
          <ConversationListItem
              key={i}
              conversationId={o.id}
              lastStatus={o.lastStatus}
              accounts={
                o.accounts.map((j) => ActivityPubUserAdapter(j, _domain))}/>
      )}
    </View>

  </TitleOnlyStackHeaderContainer>
}

function WithContexts() {
  return <WithAppPaginationContext>
    <WithApi/>
  </WithAppPaginationContext>
}

/**
 * This Screen lists the direct conversations
 * of the user.
 * @constructor
 */
function DirectMessaging() {
  return <WithContexts/>
}

export default DirectMessaging