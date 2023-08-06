import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { View, Text } from "react-native";
import { StandardView } from "../../../styles/Containers";
import { Divider } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import {
	decodeHTMLString,
	parseStatusContent,
} from "@dhaaga/shared-utility-html-parser/dist";
import React from "react";
import { parseNode } from "./util";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../libs/redux/store";
import { AccountState } from "../../../libs/redux/slices/account";
import OriginalPoster from "../../../components/post-fragments/OriginalPoster";
import { Note, UserLite } from "@dhaaga/shared-provider-misskey/dist";
import StatusInteraction from "./StatusInteraction";

type StatusFragmentProps = {
	status: mastodon.v1.Status | Note;
	mt?: number;
};

function RootStatusFragment({ status, mt }: StatusFragmentProps) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);

	const [PosterContent, setPosterContent] = useState(<View></View>);

	useEffect(() => {
		switch (accountState.activeAccount?.domain) {
			case "mastodon": {
				const _status = status as mastodon.v1.Status;
				setPosterContent(
					<OriginalPoster
						avatarUrl={_status.account.avatar}
						displayName={_status.account.displayName}
						createdAt={_status.createdAt}
						username={_status.account.username}
						subdomain={accountState?.activeAccount?.subdomain}
						visibility={_status.visibility}
						accountUrl={_status.account.url}
					/>
				);
				break;
			}
			case "misskey": {
				const _status = status as Note;
				const { user, ...rest } = _status;

				setPosterContent(
					<OriginalPoster
						avatarUrl={_status.user.avatarUrl}
						displayName={_status.user.name}
						username={_status.user.username}
						createdAt={_status.createdAt}
						subdomain={accountState?.activeAccount?.subdomain}
						visibility={_status.visibility}
						accountUrl={""}
					/>
				);
				break;
			}
			default: {
				setPosterContent(<View></View>);
				break;
			}
		}
	}, [status]);

	const [Content, setContent] = useState([]);

	useEffect(() => {
		let content = "";
		let emojis = [];
		switch (accountState?.activeAccount?.domain) {
			case "mastodon": {
				content = (status as mastodon.v1.Status).content;
				emojis = (status as mastodon.v1.Status).emojis;
				break;
			}
			case "misskey": {
				content = (status as Note).text;
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
				retval.push(parseNode(node, count.toString(), status?.emojis || []));
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

			{/* <ImageCarousal attachments={status.mediaAttachments} /> */}
			{/* <EmojiBoard status={status} /> */}
			<StatusInteraction post={status} statusId={status.id} />
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
	const [Username, setUsername] = useState("");

	useEffect(() => {
		switch (accountState.activeAccount?.domain) {
			case "mastodon": {
				setUsername((postedBy as mastodon.v1.Account).username);
				break;
			}
			case "misskey": {
				setUsername((postedBy as UserLite).username);
				break;
			}
			default: {
				break;
			}
		}
	}, [status, boostedStatus]);

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
					{Username}
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

	switch (accountState.activeAccount?.domain) {
		case "mastodon": {
			const _status = status as mastodon.v1.Status;
			if (_status.reblog) {
				return (
					<SharedStatusFragment
						status={_status.reblog}
						postedBy={_status.account}
						boostedStatus={_status}
					/>
				);
			}
			return <RootStatusFragment status={status} />;
		}
		case "misskey": {
			const _status = status as Note;
			if (_status.renote) {
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
