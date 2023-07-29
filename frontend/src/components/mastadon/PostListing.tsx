import { Box, Divider, Flex, Image, Text } from "@mantine/core";
import { mastodon } from "masto";
import { formatDistance } from "date-fns";
import {
	IconBackhoe,
	IconBookmark,
	IconDownload,
	IconExternalLink,
	IconRocket,
	IconStar,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { COLUMN_MIN_WIDTH } from "../../constants/app-dimensions";
import {
	MastadonStatusItem,
	PostInteractionElement,
	PostOwnerImage,
	TextSubtitle,
	TextTitle,
} from "../../styles/Mastodon";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
	LatestTabRendererState,
	latestTabRendererSlice,
} from "../../lib/redux/slices/latestTabRenderer";
import { COLUMNS } from "../utils/constansts";
import RebloggedPost from "./post/RebloggedPost";
import { resolveProfileUrl } from "../../utils/Mastadon";
import { NavigationManager } from "../../services/navigation-manager.service";
import React from "react";

function MastadonPostListing({ post }: { post: mastodon.v1.Status }) {
	const dispatch = useDispatch<AppDispatch>();
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);

	const [LocalState, setLocalState] = useState({
		bookmarked: false,
		favourited: false,
		boosted: false,
	});

	useEffect(() => {
		setLocalState({
			bookmarked: post?.bookmarked || false,
			favourited: post?.favourited || false,
			boosted: post?.reblogged || false,
		});
	}, [post]);

	function substituteHTML(input: string): string {
		// disable all hrefs
		var el = document.createElement("html");
		el.innerHTML = input;

		const links = el.getElementsByTagName("a");
		for (let index = 0; index < links.length; index++) {
			links[index].setAttribute(
				"data-original-href",
				links[index].getAttribute("href")!
			);
			links[index].href = "javascript: void(0)";
		}

		// return modified html
		return el.innerHTML;
	}

	function onDownloadClicked() {}
	function onFavouriteClicked() {}

	function onReplyClicked() {}

	function onBoostClicked() {}

	function onBookmarkClicked() {
		console.log(post.bookmarked);
		if (LocalState.bookmarked) {
			// MastadonService.unbookmarkStatus(  post.id);
		}
		setLocalState({
			...LocalState,
			bookmarked: !LocalState.bookmarked,
		});
	}

	const canPushAsColumn = useMemo(
		() =>
			NavigationManager.canAppendColumn(
				latestTabPushHistory.stack,
				COLUMNS.MASTADON_V1_STATUS
			),
		[latestTabPushHistory.stack]
	);

	function onPostClicked() {
		if (!canPushAsColumn) return;

		dispatch(
			latestTabRendererSlice.actions.addStack({
				type: COLUMNS.MASTADON_V1_STATUS,
				query: {
					id: post.id,
				},
				label: "Status",
			})
		);
	}

	if (post && post.reblog !== undefined && post.reblog !== null) {
		return (
			<Box miw={"100%"} maw={COLUMN_MIN_WIDTH}>
				<RebloggedPost post={post.reblog} repostedBy={post.account} />
			</Box>
		);
	}

	return (
		<React.Fragment>
			<MastadonStatusItem miw={"100%"} maw={COLUMN_MIN_WIDTH}>
				<Flex direction={"column"} onClick={onPostClicked}>
					<Flex>
						<PostOwnerImage src={post.account.avatar} />
						<Flex justify={"space-between"} w={"100%"}>
							<Flex direction={"column"} ml={"0.5rem"}>
								<Flex align={"flex-end"} justify={"flex-end"}>
									<TextTitle lineClamp={1} maw={200}>
										{post?.account?.displayName || post.account.username}
									</TextTitle>
									<TextSubtitle ml={"2px"}>
										{post?.account?.displayName
											? `@${post.account.username}`
											: resolveProfileUrl(post.account).usernameAtServer}
									</TextSubtitle>
								</Flex>
								<TextSubtitle lh={1.2}>
									{formatDistance(new Date(post.createdAt), new Date(), {
										addSuffix: true,
									})}
								</TextSubtitle>
							</Flex>
						</Flex>
					</Flex>
					<div
						style={{ lineHeight: 1.2, fontSize: 15 }}
						dangerouslySetInnerHTML={{ __html: substituteHTML(post.content) }}
					/>
				</Flex>

				<Carousel
					withIndicators
					styles={{
						control: {
							"&[data-inactive]": {
								opacity: 0,
								cursor: "default",
							},
						},
					}}
					w={"100%"}
				>
					{post.mediaAttachments.map((o, i) => (
						<Carousel.Slide
							key={i}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: COLUMN_MIN_WIDTH,
							}}
						>
							<Image src={o.previewUrl} key={i} />
						</Carousel.Slide>
					))}
				</Carousel>

				<Flex mt={"xs"} justify={"space-between"}>
					<PostInteractionElement activebg={"lightgreen"}>
						<IconBackhoe />
						<Text>{post.repliesCount}</Text>
					</PostInteractionElement>

					<PostInteractionElement activebg="lightblue">
						<IconRocket />
						<Text>{post.reblogsCount}</Text>
					</PostInteractionElement>
					<PostInteractionElement activebg="orange">
						<IconStar />
						<Text>{post.favouritesCount}</Text>
					</PostInteractionElement>
					<PostInteractionElement activebg={"red"}>
						<IconBookmark />
					</PostInteractionElement>
					<PostInteractionElement
						as={"div"}
						activebg={"lightgreen"}
						onClick={onDownloadClicked}
					>
						<IconDownload />
					</PostInteractionElement>
					<PostInteractionElement activebg={"lightgreen"}>
						<IconExternalLink />
					</PostInteractionElement>
				</Flex>
			</MastadonStatusItem>
		</React.Fragment>
	);
}

export default MastadonPostListing;
