import { Box, Divider, Flex, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { mastodon } from "masto";

/**
 * Renders the external linksfor a mastodon profile
 * @param param0
 * @returns
 */
function ExternalLinks({
	fields,
}: {
	fields: mastodon.v1.AccountField[] | null | undefined;
}) {
	return (
		fields &&
		fields?.length > 0 && (
			<Box
				px={"xs"}
				pb={"0.25em"}
				pt={"0em"}
				bg={"#eee"}
				style={{ borderRadius: "0.5rem" }}
			>
				{fields?.map((x, i) => (
					<Box key={i} mb={"xs"}>
						<Text style={{ fontSize: 15, fontWeight: 500 }}>{x.name}</Text>
						<Flex style={{ fontSize: 14 }} align={"center"}>
							{x.verifiedAt ? (
								<IconCheck
									style={{
										color: "green",
									}}
								/>
							) : (
								<></>
							)}
							<div
								style={{
									color: "#888",
									fontSize: 14,
									lineHeight: 1.2,
									textDecoration: "none",
								}}
								dangerouslySetInnerHTML={{ __html: x.value }}
							/>
						</Flex>
						{i === fields!.length - 1 ? (
							<></>
						) : (
							<Divider color={"#aaa"} mt={"xs"} />
						)}
					</Box>
				))}
			</Box>
		)
	);
}

export default ExternalLinks;
