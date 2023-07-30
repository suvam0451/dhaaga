import { Box, Flex, Text } from "@mantine/core";
import Image from "next/image";

// assets
import GalleryStyleSearchModuleShowcase from "../../../../../assets/client-showcase/Search_Showcase.png";
import DesktopGallery from "../../../../../assets/desktop-showcase/Three_Column_Full_Size.png";

function QolCategory() {
	return (
		<Flex justify={"space-between"} w={"100%"}>
			<Box color={"red"} maw={450}>
				<Text size={16} color={"red"}>
					Convenience
				</Text>
				<Text size={28}>Every workflow is designed to be</Text>
				<Text size={28} color={"red"}>
					effortless and easy
				</Text>
				<Text>
					Improve the way you browse social networks, be it with your mouse or
					your keyboard.
				</Text>

				<Box my={"md"} bg={"#fff"} style={{ padding: "1rem" }}>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						Media Gallery
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							'"Media Only" timeline columns gets a new rework. Navigate gallery-style view with your keyboards.'
						}
					</Text>
				</Box>

				<Box mt={"md"} bg={"#fff"} style={{ padding: "1rem" }}>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						Three Column Layout
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							"Perfect balance between the multi-column layouts and modern single-column zen layouts."
						}
					</Text>
				</Box>
				<Box mt={"md"} bg={"#fff"} style={{ padding: "1rem" }}>
					<Text
						color={"black"}
						style={{ fontWeight: 600, fontSize: "0.875rem" }}
					>
						Scroll to Top
					</Text>
					<Text color={"gray"} style={{ fontSize: "0.875rem" }}>
						{
							"Every relevant column loads new set of posts automatically. A handy scroll-to-top button makes."
						}
					</Text>
				</Box>
			</Box>
			<Box w={16} />
			<Box pos={"relative"} w={600} style={{ overflowX: "clip" }}>
				<Image
					height={500}
					objectFit="contain"
					// src={GalleryStyleSearchModuleShowcase}
					src={DesktopGallery}
					alt={"showcase"}
				/>
			</Box>
		</Flex>
	);
}

export default QolCategory;
