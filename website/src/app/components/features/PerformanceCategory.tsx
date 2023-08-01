import { useMemo, useState } from "react";

// assets
import GalleryStyleSearchModuleShowcase from "../../../../../assets/client-showcase/Search_Showcase.png";
import DesktopGallery from "../../../../../assets/desktop-showcase/Three_Column_Full_Size.png";
import { ScrollImageHorizontallyOnHover } from "@/app/styles/App";
import { Box, Flex, Text } from "@mantine/core";

function PerformanceCategory() {
	const [SelectedCard, setSelectedCard] = useState("media-gallery");

	const ImageToShow: Record<string, any> = {
		"media-gallery": {
			image: GalleryStyleSearchModuleShowcase,
			layout: "image",
			scrollBy: "0%",
		},
		"three-column-layout": {
			image: DesktopGallery,
			layout: "carousal",
			scrollBy: "-25%",
		},
		"scroll-to-top": {
			image: DesktopGallery,
			layout: "carousal",
			scrollBy: "-25%",
		},
	};

	const SelectedComponent = useMemo(
		() => ImageToShow[SelectedCard],
		[SelectedCard]
	);

	return (
		<Flex justify={"space-between"} w={"100%"}>
			<Box color={"red"} maw={450}>
				<Text size={16} color={"red"}>
					Productivity
				</Text>
				<Text size={28}>Every integration is designed to be</Text>
				<Text size={28} color={"red"}>
					{"utilitarian and hella' fun"}
				</Text>
				<Text>
					Go beyond your community. Explore new art and cultures with AI powered
					explanations.
				</Text>

				<Box
					my={"md"}
					bg={"#fff"}
					style={{ padding: "1rem" }}
					onClick={() => {
						setSelectedCard("media-gallery");
					}}
				>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						AI Powered Explanations
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							"No more missing out because of language/context barriers. ChatGPT integration comes to the rescue!"
						}
					</Text>
				</Box>

				<Box
					my={"md"}
					bg={"#fff"}
					style={{ padding: "1rem" }}
					onClick={() => {
						setSelectedCard("media-gallery");
					}}
				>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						Background Task Runners
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							"Run background tasks (Stream PeerTube 😉) from one account, while browsing posts from another."
						}
					</Text>
				</Box>

				<Box
					my={"md"}
					bg={"#fff"}
					style={{ padding: "1rem" }}
					onClick={() => {
						setSelectedCard("media-gallery");
					}}
				>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						Multi-Protocol Support
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							"Your protocol got emojis? What a coincidence. We got em' too 😎. Switch protocols/accounts at any time, from any page."
						}
					</Text>
				</Box>
			</Box>
			<Box w={16} />
			<Flex
				align={"center"}
				justify={
					SelectedComponent.layout === "carousal" ? "flex-start" : "center"
				}
				pos={"relative"}
				direction={"column"}
				w={600}
				style={{
					overflowX: "clip",
					// border: "4px solid #ddd",
					borderRadius: "0.25rem",
				}}
			>
				<Flex
					w={"100%"}
					justify={
						SelectedComponent.layout === "carousal" ? "flex-start" : "center"
					}
				>
					<ScrollImageHorizontallyOnHover
						height={500}
						objectFit="contain"
						src={SelectedComponent.image}
						alt={"showcase"}
						style={{
							boxShadow: "2px 2px",
							border: "4px solid #333",
							borderRadius: "0.25rem",
						}}
						moveby={SelectedComponent.scrollBy}
					/>
				</Flex>
				{/* <Flex align={"center"} justify={"center"} my={"xs"}>
					<IconChevronLeft size={32} />
					<IconChevronRight size={32} />
				</Flex> */}
			</Flex>
		</Flex>
	);
}

export default PerformanceCategory;
