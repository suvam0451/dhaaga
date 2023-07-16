import { Box, Container, Flex } from "@mantine/core";
import Sidebar from "../components/sidebar/Sidebar";
import { APP_MAX_HEIGHT } from "../constants/app-dimensions";

function AppScreenLayout({ children }: React.PropsWithChildren) {
	return (
		<div id="App">
			<Container p={"0"}>
				<Flex dir="row">
					<Sidebar />
					<Box px={"md"} pt={"md"}>
						{children}
					</Box>
				</Flex>
			</Container>
		</div>
	);
}

export default AppScreenLayout;
