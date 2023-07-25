import { Box, Flex, Text, Image, Tooltip } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
	LatestTabRendererState,
	latestTabRendererSlice,
} from "../../lib/redux/slices/latestTabRenderer";
import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
import MastadonLogo from "../../assets/icons/Logo_Mastodon.svg";

function DiscoverModuleBreadcrumbs({ index }: { index: number }) {
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);
	const dispatch = useDispatch<AppDispatch>();
	if (latestTabPushHistory.stack.length < index + 1)
		return (
			<Box>
				<Text>Broken data. Cannot render breadcrumbs</Text>
			</Box>
		);

	const nodes = latestTabPushHistory.stack.slice(0, index + 1);
	return (
		<Flex
			bg={"#eee"}
			p={"0.25em"}
			align={"center"}
			mb={"md"}
			style={{borderRadius: "0.5rem"}}
		>
			<Tooltip label={"Currently logged in as"}>
				<Image
					src={MastadonLogo}
					style={{
						width: "20px",
						height: "20px",
					}}
				/>
			</Tooltip>

			{nodes.map((o, i) => (
				<React.Fragment key={i}>
					<IconChevronRight
						style={{
							marginLeft: "2px",
							marginRight: "2px",
							position: "relative",
							top: "1px",
						}}
						size={16}
					/>
					<Text
						onClick={() => {
							dispatch(latestTabRendererSlice.actions.sliceStackByIndex(i + 1));
						}}
						style={{ fontWeight: i === nodes.length - 1 ? 500 : 0 }}
					>
						{o.label}
					</Text>
				</React.Fragment>
			))}
		</Flex>
	);
}

export default DiscoverModuleBreadcrumbs;
