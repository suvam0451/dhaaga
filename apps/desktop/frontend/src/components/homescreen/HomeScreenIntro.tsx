import { Text, Box, Image, Flex } from "@mantine/core";
import {
	APP_MAX_HEIGHT,
} from "../../constants/app-dimensions";
import ThreadsLogo from "../../assets/icons/Logo_Threads.svg";

// A feature-rich desktop _client for instagram Threads
// A feature-rich desktop social media _client for enthusiasts

function HomeScreenIntro() {
	return (
		<Box maw={APP_MAX_HEIGHT} my={"lg"}>
			<Text span size={48} fw={"bold"}>
      Feature-rich social media client for enthusiasts 
			</Text>
			<Text my={"xl"} size={20}>
				This is an unofficial desktop client for popular social media platforms.

			</Text>
			<Flex style={{ alignItems: "center" }}>
				<Text span>Supported Platforms</Text>
				<Box mx={"md"} w={32}>
					<Image
						mx="auto"
						radius="md"
						alt={"Image"}
						pos={"relative"}
						fit={"fill"}

						src={ThreadsLogo}
					/>
				</Box>
			</Flex>
			<Text my={"xl"} size={20}>
				With a beautiful interface ✨ built with web technologies 🌐 and a powerful 💪
				service worker written in go, this app checks all boxes for media enthusiasts 📷 and OSINT devs 🧑‍💻.
			</Text>
			<Text span size={48} fw={"bold"}></Text>{" "}
			<Text span size={48} fw={"bold"}></Text>
			<Text></Text>
		</Box>
	);
}

export default HomeScreenIntro;
