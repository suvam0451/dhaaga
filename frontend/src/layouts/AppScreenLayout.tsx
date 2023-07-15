import { Box, Container, Flex } from "@mantine/core";
import Sidebar from "../components/sidebar/Sidebar";
import { APP_MAX_HEIGHT } from "../constants/app-dimensions";

function AppScreenLayout({ children }: React.PropsWithChildren) {
	return (
		<div id="App">
			<Container mah={APP_MAX_HEIGHT} pt={"md"}>
				<Flex dir="row">
					<Sidebar />
					<Box px={"md"}>{children}</Box>
				</Flex>
			</Container>
		</div>
	);
}

export default AppScreenLayout;
