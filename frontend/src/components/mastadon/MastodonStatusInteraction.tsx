import { Box, Flex, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { mastodon } from "masto";
import { useEffect } from "react";

/**
 * Used for the status details column
 * @param param0
 */
function MastadonStatusInteractions({ post }: { post: mastodon.v1.Status }) {
	useEffect(() => {
		console.log(post);
	}, [post]);


	return (
		<Box>
			<Flex align={"center"} justify={"space-between"}>
				<Text>{post.reblogsCount} boosts</Text>
				<IconChevronRight />
			</Flex>
      <Flex align={"center"} justify={"space-between"}>
				<Text>{post.repliesCount} replies</Text>
				<IconChevronRight />
			</Flex>
		</Box>
	);
}

export default MastadonStatusInteractions;
