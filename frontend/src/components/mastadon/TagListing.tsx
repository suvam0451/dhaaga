import { Box, Divider, Text } from "@mantine/core";
import { mastodon } from "masto";
import { useMemo } from "react";

function MastadonTagListing({ tag }: { tag: mastodon.v1.Tag }) {
	const totalUsers = useMemo(() => {
		return tag.history!.reduce((a, b) => a + parseInt(b.accounts), 0);
	}, [tag]);
	const totalUsage = useMemo(() => {
		return tag.history!.reduce((a, b) => a + parseInt(b.uses), 0);
	}, [tag]);

	return (
		<Box mt={"xs"} h={"100%"}>
			<Text
				style={{ fontWeight: 600, lineHeight: 1 }}
				color={tag.following ? "yellow" : "black"}
			>
				#{tag.name}
			</Text>

			<Text style={{ fontSize: 13 }}>
				{Intl.NumberFormat("en", { notation: "compact" }).format(totalUsage)}{" "}
				posts from{" "}
				{Intl.NumberFormat("en", { notation: "compact" }).format(totalUsers)}{" "}
				users
			</Text>
			<Divider mt={"xs"}/>
		</Box>
	);
}

export default MastadonTagListing;
