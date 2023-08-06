import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Note } from "@dhaaga/shared-provider-misskey/dist";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../libs/redux/store";
import { AccountState } from "../../../libs/redux/slices/account";

type StatusInteractionProps = {
	statusId: string;
	post: mastodon.v1.Status | Note;
};

const ICON_SIZE = 18;

function StatusInteraction({ statusId, post }: StatusInteractionProps) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);

	const [RepliesCount, setRepliesCount] = useState(0);
	const [FavouritesCount, setFavouritesCount] = useState(-1);
	const [RepostCount, setRepostCount] = useState(-1);

	useEffect(() => {
		switch (accountState.activeAccount?.domain) {
			case "mastodon": {
				const _status = post as mastodon.v1.Status;
				setRepliesCount(_status.repliesCount);
				setFavouritesCount(_status.favouritesCount);
				setRepostCount(_status.reblogsCount);
				break;
			}
			case "misskey": {
				const _status = post as Note;
				setRepliesCount(_status.repliesCount);
				setRepostCount(_status.renoteCount);
				break;
			}
		}

		return () => {};
	}, []);

	return (
		<View
			style={{
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "row",
				marginBottom: 8,
				marginTop: 12,
			}}
		>
			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Ionicons color={"#888"} name={"arrow-undo-outline"} size={ICON_SIZE} />
				<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
					{post.repliesCount}
				</Text>
			</View>

			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Ionicons color={"#888"} name={"rocket-outline"} size={ICON_SIZE} />
				<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
					{RepostCount}
				</Text>
			</View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE} />
				{FavouritesCount !== -1 && (
					<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
						{FavouritesCount}
					</Text>
				)}
			</View>
			<Ionicons color={"#888"} name={"bookmark-outline"} size={ICON_SIZE} />
			<Ionicons color={"#888"} name={"language-outline"} size={ICON_SIZE} />
		</View>
	);
}

export default StatusInteraction;
