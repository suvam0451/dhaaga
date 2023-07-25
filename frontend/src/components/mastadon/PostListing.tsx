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

function MastadonPostListing({ post }: { post: mastodon.v1.Status }) {
	function onLinkAccessAttempt(s: string) {
		console.log("trying to access", s);
	}

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

			links[index].style.maxWidth = "10px";
			links[index].href = "javascript: void(0)";
		}

		// redirect all hrefs
		const $elems = document.querySelectorAll("a");
		var elems = Array.from($elems);
		elems.map((a) => {
			const localLinks = /\/(.*?)/;
			if (/\/(.*?)/.test(a.getAttribute("href")!)) {
				return;
			}
			// @ts-ignore
			a.onclick = (e) => {
				e.preventDefault();
				const targetItem = e.currentTarget;
				// @ts-ignore
				const val = targetItem.getAttribute("data-original-href");
				if (val) {
					onLinkAccessAttempt(val);
				}
			};
		});

		// return modified html
		return el.innerHTML;
	}

	return (
		<Box>
			<Flex>
				<Box h={"48px"} w={"48px"}>
					<Image src={post.account.avatar} />
				</Box>
				<Flex justify={"space-between"} w={"100%"}>
					<Flex direction={"column"} ml={"0.5rem"}>
						<Flex align={"flex-end"} justify={"flex-end"}>
							<Text style={{ fontWeight: 500 }}>
								{post.account.displayName}
							</Text>
							<Text style={{ fontSize: 14, color: "#888", marginLeft: "2px" }}>
								@{post.account.username}
							</Text>
						</Flex>
						<Flex>
							<Text lh={1} style={{ fontSize: 14 }}>
								{formatDistance(new Date(post.createdAt), new Date(), {
									addSuffix: true,
								})}
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<Box mt={0}>
				<div
					style={{ lineHeight: 1.2, fontSize: 15 }}
					dangerouslySetInnerHTML={{ __html: substituteHTML(post.content) }}
				/>
			</Box>

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
			>
				{post.mediaAttachments.map((o, i) => (
					<Carousel.Slide
						key={i}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							src={o.previewUrl}
							key={i}
							style={{ borderRadius: "2rem" }}
						/>
					</Carousel.Slide>
				))}
			</Carousel>

			<Flex mt={"xs"} justify={"space-between"}>
				<Flex>
					<IconBackhoe color={"#777"} />
					<Text color={"#777"} ml={"0.25rem"}>
						{post.repliesCount}
					</Text>
				</Flex>

				<Flex>
					<IconStar color={"#777"} />
					<Text color={"#777"} ml={"0.25rem"}>
						{post.favouritesCount}
					</Text>
				</Flex>
				<Flex>
					<IconRocket color={"#777"} />
					<Text color={"#777"} ml={"0.25rem"}>
						{post.reblogsCount}
					</Text>
				</Flex>
				<IconDownload color={"#777"} />
				<IconBookmark color={"#777"} />
				<IconExternalLink color={"#777"} />
			</Flex>
			<Divider mb={"md"} mt={"md"} />
		</Box>
	);
}

export default MastadonPostListing;
