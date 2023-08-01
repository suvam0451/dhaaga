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
import { useInView } from "react-intersection-observer";
import { useInViewHook } from "../../contexts/IntersectionContext";

function MastadonPostListing({
	post,
	reblogged,
	index,
}: {
	post: mastodon.v1.Status;
	reblogged?: boolean;
	index: number;
}) {
	const dispatch = useDispatch<AppDispatch>();
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);

	const { store: inViewStore, dispatch: inViewDispatch } = useInViewHook();

	const { ref, inView, entry } = useInView({
		/* Optional options */
		threshold: 0,

	});


	// useEffect(() => {
	// 	console.log("visibility changed", inViewStore.inView)
	// }, [inViewStore])
	
	useEffect(() => {
		if(inView) {
			inViewDispatch.add(index);
		} else {
			inViewDispatch.remove(index);
		}

		// console.log("item in view?", inView, ref, entry);
	}, [inView]);

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

		if (
			latestTabPushHistory.stack.length >= 2 &&
			latestTabPushHistory.stack[1].type === COLUMNS.MASTODON_V1_PROFILE_OTHER
		) {
			dispatch(
				latestTabRendererSlice.actions.spliceStackAddItems({
					index: 2,
					items: [
						{
							type: COLUMNS.MASTADON_V1_STATUS,
							query: {
								id: post.id,
							},
							label: "Status",
						},
					],
				})
			);
		} else {
			dispatch(
				latestTabRendererSlice.actions.spliceStackAddItems({
					index: 1,
					items: [
						{
							type: COLUMNS.MASTADON_V1_STATUS,
							query: {
								id: post.id,
							},
							label: "Status",
						},
					],
				})
			);
		}
	}

	if (post && post.reblog !== undefined && post.reblog !== null) {
		return (
			<Box ref={ref} miw={"100%"} maw={COLUMN_MIN_WIDTH}>
				<Text bg={"red"}>{index}</Text>
				<RebloggedPost post={post.reblog} repostedBy={post.account} index={index} />
			</Box>
		);
	}

	return (
		<Box ref={ref}>
			<MastadonStatusItem
				miw={"100%"}
				maw={COLUMN_MIN_WIDTH}
				reblogged={reblogged}
			>
				<Flex direction={"column"} onClick={onPostClicked}>
					<Flex>
						<PostOwnerImage src={post.account.avatar} />
						<Flex justify={"space-between"} w={"100%"}>
							<Flex direction={"column"} ml={"0.5rem"}>
								<Flex align={"flex-end"} justify={"flex-start"}>
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
		</Box>
	);
}

export default MastadonPostListing;
