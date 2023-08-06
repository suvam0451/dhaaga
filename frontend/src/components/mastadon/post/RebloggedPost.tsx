import { Box, Flex, Text } from "@mantine/core";
import { mastodon } from "masto";
import MastadonPostListing from "../PostListing";
import { PostBoosterImage, TextSubtitle } from "../../../styles/Mastodon";
import { FaRetweet } from "react-icons/fa";
import { formatRelative } from "date-fns";

function RebloggedPost({
	post,
	repostedBy,
	index,
}: {
	repostedBy: mastodon.v1.Account;
	post: mastodon.v1.Status;
	index: number;
}) {
	return (
		<Box h={"100%"} pt={"md"}>
			<Flex direction={"row"} align={"center"} my={"4px"}>
				<FaRetweet color="#aaa" size={20} />
				<PostBoosterImage src={repostedBy.avatar} />
				<TextSubtitle ml={"4px"}>{repostedBy.displayName} boosted</TextSubtitle>
			</Flex>
			<MastadonPostListing post={post!} reblogged index={index} />
		</Box>
	);
}

export default RebloggedPost;
