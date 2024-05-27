import {View} from "react-native";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {UserInterface} from "@dhaaga/shared-abstraction-activitypub/src";
import {Image} from "expo-image";
import React from "react";
import WithActivitypubStatusContext from "../../../../../states/useStatus";
import ConversationItem from "../../../../common/status/ConversationItem";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../libs/redux/store";
import {AccountState} from "../../../../../libs/redux/slices/account";

type ConversationListItemProps = {
  lastStatus: mastodon.v1.Status,
  accounts: UserInterface[],
  unread?: boolean
}

function ConversationListItem({
  lastStatus,
  accounts,
  unread
}: ConversationListItemProps) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);

  if (accounts.length === 0) return <View></View>
  if (accounts.length > 1) return <View></View>

  const subdomain = accountState?.activeAccount?.subdomain
  const _account = accounts[0]

  const appAccountUrl = _account.getAppDisplayAccountUrl(subdomain)

  return <View style={{
    display: "flex", flexDirection: "row", backgroundColor: "#141414",
    paddingVertical: 4,
    marginVertical: 4
  }}>
    <View style={{flexGrow: 0}}>
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
            source={_account.getAvatarUrl()}
        />
      </View>
    </View>
    <View style={{marginLeft: 4}}>
      <WithActivitypubStatusContext status={lastStatus}>
        <ConversationItem
            displayName={_account.getDisplayName()}
            accountUrl={appAccountUrl}
            unread={unread}
        />
      </WithActivitypubStatusContext>
    </View>
  </View>
}

export default ConversationListItem;