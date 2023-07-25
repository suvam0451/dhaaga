import { Box, Container, Flex } from "@mantine/core";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

function AppScreenLayout({ children }: React.PropsWithChildren) {
	return (
		<div id="App">
			<Container p={"0"}>
				<Flex dir="row" mah={"100vh"}>
					<Sidebar />
					<Flex direction={"column"}>
						<Box px={"md"} pt={"md"}>
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
