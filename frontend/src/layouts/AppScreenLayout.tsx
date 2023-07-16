import { Box, Container, Flex } from "@mantine/core";
import Sidebar from "../components/sidebar/Sidebar";
import {
	APP_MAX_HEIGHT,
	GALLERY_FIXED_HEIGHT,
} from "../constants/app-dimensions";
import Footer from "../components/footer/Footer";

function AppScreenLayout({ children }: React.PropsWithChildren) {
	return (
		<div id="App">
			<Container p={"0"}>
				<Flex dir="row" mih={"100vh"}>
					<Sidebar />
					<Flex direction={"column"}>
						<Box px={"md"} pt={"md"} mih={APP_MAX_HEIGHT}>
							{children}
						</Box>
						<Footer />
					</Flex>
				</Flex>
			</Container>
		</div>
	);
}

export default AppScreenLayout;
