import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../libs/redux/store";
import { AccountState } from "../../../libs/redux/slices/account";
import StatusFragment from "../../timelines/fragments/StatusFragment";
import { ScrollView } from "react-native";
import { Skeleton } from "@rneui/base";
import {
	ActivityPubClientFactory,
	ActivityPubStatuses,
	MastodonRestClient,
	MisskeyRestClient,
	UnknownRestClient,
} from "@dhaaga/shared-abstraction-activitypub/src";

function HashtagBrowse({ route, navigation }) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);
	const q = route?.params?.q;
	const restClient = useRef<
		MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
	>(null);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		if (!accountState.activeAccount) {
			restClient.current = null;
			console.log("have not selected any account");
			return;
		}

		const token = accountState.credentials.find(
			(o) => o.credential_type === "access_token"
		)?.credential_value;
		if (!token) {
			restClient.current = null;
			console.log("token not found");
			return;
		}

		const client = ActivityPubClientFactory.get(
			accountState.activeAccount.domain as any,
			{
				instance: accountState.activeAccount.subdomain,
				token,
			}
		);
		restClient.current = client;
	}, [accountState]);

	function getStatusesWithTag() {
		if (!restClient.current) {
			throw new Error("client not initialized");
		}
		return restClient.current.getTimelineByHashtag(q);
	}

	// Queries
	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubStatuses>({
			queryKey: ["mastodon/timelines/tag", restClient.current, q],
			queryFn: getStatusesWithTag,
			enabled: q !== undefined,
		});

	useEffect(() => {
		if (status === "success") {
			setRefreshing(false);
		}
	}, [status, fetchStatus]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refetch();
	}, []);

	return data ? (
		<ScrollView
			style={{ backgroundColor: "black" }}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{data.map((o, i) => (
				<StatusFragment key={i} status={o} />
			))}
			<Text style={{ color: "white" }}>{q}</Text>
		</ScrollView>
	) : (
		<Skeleton />
	);
}

export default HashtagBrowse;
