import { Box, Container, Flex } from "@mantine/core";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

function AppScreenLayout({ children }: React.PropsWithChildren) {
	return (
		<div id="App" style={{overflowY: "clip"}}>
			<Container size={"xl"} p={0} my={0} style={{overflowY: "clip"}}>
				<Flex dir="row" h={"100vh"} style={{overflowY: "clip"}} >
					<Sidebar />
					<Flex direction={"column"} h={"100%"} style={{overflowY: "clip"}}>
						<Box px={"md"} pt={"md"} h={"100%"} style={{overflowY: "clip"}}>
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
