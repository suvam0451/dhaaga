import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {View} from "react-native";
import StatusItem
  from "../../common/status/StatusItem";
import WithActivitypubStatusContext from "../../../states/useStatus";
import {Button} from "@rneui/themed";

function FollowedPosts() {
  const {client} = useActivityPubRestClientContext()

  async function api() {
    if (!client) {
      throw new Error("_client not initialized");
    }
    const retval = await client.getFavourites({
      limit: 5
    });
    console.log("result is", retval)
    return retval
  }

  // Queries
  const {data, refetch} = useQuery<
      mastodon.v1.Status[] | Note[]
  >({
    queryKey: ["favourites"],
    queryFn: api,
    enabled: client !== null
  });

  return <View>
    <Button onPress={() => {
      refetch()
    }}>Refresh</Button>
    {data && data.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem/>
        </WithActivitypubStatusContext>
    )}
  </View>
}

export default FollowedPosts;