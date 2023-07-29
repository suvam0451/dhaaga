import { Box, Flex } from "@mantine/core";
import { mastodon } from "masto";
import MastadonPostListing from "../PostListing";
import { PostBoosterImage, TextSubtitle } from "../../../styles/Mastodon";
import { FaRetweet } from "react-icons/fa";

function RebloggedPost({
	post,
	repostedBy,
}: {
	repostedBy: mastodon.v1.Account;
	post: mastodon.v1.Status;
}) {
	return (
		<Box h={"100%"} pt={"md"}>
			<Flex direction={"row"} align={"center"} my={"4px"}>
				<FaRetweet color="#aaa" size={20} />
				<PostBoosterImage src={repostedBy.avatar} />
				<TextSubtitle ml={"4px"}>{repostedBy.displayName} boosted</TextSubtitle>
			</Flex>
			<MastadonPostListing post={post!} reblogged />
		</Box>
	);
}

export default RebloggedPost;
