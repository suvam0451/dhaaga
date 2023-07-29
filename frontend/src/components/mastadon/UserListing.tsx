import { Box, Button, Divider, Flex, Image, Text } from "@mantine/core";
import { mastodon } from "masto";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
	LatestTabRendererState,
	latestTabRendererSlice,
} from "../../lib/redux/slices/latestTabRenderer";
import { COLUMNS } from "../utils/constansts";
import { ProfilePicSearchResult } from "../../styles/Mastodon";

function MastadonUserListing({ user }: { user: mastodon.v1.Account }) {
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);
	const dispatch = useDispatch<AppDispatch>();

	function onComponentClicked() {
		dispatch(
			latestTabRendererSlice.actions.spliceStackAddItems({
				index: 1,
				items: [
					{
						type: COLUMNS.MASTODON_V1_PROFILE_OTHER,
						query: {
							userId: user.id,
						},
						label: "User Profile",
					},
				],
			})
		);
	}

	return (
		<Box my={"xs"}>
			<Flex onClick={onComponentClicked}>
				<ProfilePicSearchResult>
					<Image src={user.avatar} />
				</ProfilePicSearchResult>
				<Box maw={300} ml={"xs"} style={{ flexGrow: 1 }}>
					<Text style={{ fontSize: 16, lineHeight: 1, fontWeight: 500 }}>
						{user.displayName}
					</Text>
					<Text
						style={{
							color: "#888",
							fontSize: 14,
						}}
						truncate
					>
						@{user.acct}
					</Text>
					<Text style={{ fontSize: 14, lineHeight: 1, fontWeight: 400 }}>
						{Intl.NumberFormat("en", { notation: "compact" }).format(
							user.followersCount
						)}{" "}
						followers
					</Text>
					<Text
						style={{
							fontSize: 13,
							lineHeight: 1.25,
						}}
						lineClamp={2}
					>
						{user.note.replace(/<[^>]+>/g, "")}
					</Text>
				</Box>
				<Box>
					<Button size={"xs"}>Follow</Button>
				</Box>
			</Flex>

			<Divider mt={"sm"} />
		</Box>
	);
}

export default MastadonUserListing;
