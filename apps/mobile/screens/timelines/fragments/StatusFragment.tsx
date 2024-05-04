import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { View, Text } from "react-native";
import { StandardView } from "../../../styles/Containers";
import { Divider } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
	decodeHTMLString,
	parseStatusContent,
} from "@dhaaga/shared-utility-html-parser/src";
import React from "react";
import { parseNode } from "./util";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../libs/redux/store";
import { AccountState } from "../../../libs/redux/slices/account";
import OriginalPoster from "../../../components/post-fragments/OriginalPoster";
import { Note, UserLite } from "@dhaaga/shared-provider-misskey/src";
import StatusInteraction from "./StatusInteraction";
import { adaptSharedProtocol } from "../../../utils/activitypub-adapters";
import ImageCarousal from "./ImageCarousal";

type StatusFragmentProps = {
	status: mastodon.v1.Status | Note;
	mt?: number;
};

function RootStatusFragment({ status, mt }: StatusFragmentProps) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);

	const [PosterContent, setPosterContent] = useState(<View></View>);

	const _status = useMemo(
		() => adaptSharedProtocol(status, accountState?.activeAccount?.domain),
		[status, accountState?.activeAccount?.domain]
	);

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

	useEffect(() => {
		let content = _status.getContent();
		// console.log(content);

		let emojis = [];
		switch (accountState?.activeAccount?.domain) {
			case "mastodon": {
				emojis = (status as mastodon.v1.Status).emojis;
				break;
			}
			case "misskey": {
				// console.log(status);
				// emojis = (status as Note).reactions
				break;
			}
			default: {
				break;
			}
		}

		const parsed = parseStatusContent(decodeHTMLString(content));

		let retval = [];
		let count = 0; //
		for (const para of parsed) {
			for (const node of para) {
				// @ts-ignore
				retval.push(
					parseNode(node, count.toString(), {
						emojis: status?.emojis || [],
						domain: accountState?.activeAccount?.domain,
						subdomain: accountState?.activeAccount?.subdomain,
					})
				);
				count++;
			}
		}
		setContent(retval);
	}, [status]);

	return (
		<StandardView>
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
					<Ionicons name="ellipsis-horizontal" size={24} color="#888" />
				</View>
			</View>

			<Text style={{ marginBottom: 16, color: "white" }}>{Content}</Text>

			<ImageCarousal attachments={_status.getMediaAttachments()} />
			{/* <EmojiBoard status={status} /> */}
			<StatusInteraction post={_status} statusId={status?.id} />
			<Divider />
		</StandardView>
	);
}
function SharedStatusFragment({
	status,
	postedBy,
	boostedStatus,
}: StatusFragmentProps & {
	postedBy: mastodon.v1.Account | UserLite;
	boostedStatus: mastodon.v1.Status | Note;
}) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);
	const _status = useMemo(
		() => adaptSharedProtocol(status, accountState?.activeAccount?.domain),
		[status, accountState?.activeAccount?.domain]
	);

	if (!_status.isValid()) return <View></View>;

	return (
		<View>
			<StandardView
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					marginTop: 16,
				}}
			>
				<Ionicons color={"#888"} name={"rocket-outline"} size={12} />
				<Text style={{ color: "#888", fontWeight: "500", marginLeft: 4 }}>
					{_status.getUsername()}
				</Text>
				<Text style={{ color: "gray", marginLeft: 2, marginRight: 2 }}>•</Text>
				<Text style={{ color: "#888" }}>
					{formatDistance(new Date(boostedStatus.createdAt), new Date(), {
						addSuffix: true,
					})}
				</Text>
			</StandardView>

			<RootStatusFragment status={status} mt={4} />
		</View>
	);
}

function StatusFragment({ status }: StatusFragmentProps) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);
	const _status = useMemo(
		() => adaptSharedProtocol(status, accountState?.activeAccount?.domain),
		[status, accountState?.activeAccount?.domain]
	);

	switch (accountState.activeAccount?.domain) {
		case "mastodon": {
			const _statuss = status as mastodon.v1.Status;
			if (_status.isReposted()) {
				return (
					<SharedStatusFragment
						status={_statuss.reblog}
						postedBy={_statuss.account}
						boostedStatus={_statuss}
					/>
				);
			}
			return <RootStatusFragment status={status} />;
		}
		case "misskey": {
			if (_status.isReposted()) {
				const _status = status as Note;
				return (
					<SharedStatusFragment
						status={_status.renote}
						postedBy={_status.user}
						boostedStatus={_status}
					/>
				);
			}
		}
	}
	return <RootStatusFragment status={status} />;
}

export default StatusFragment;
