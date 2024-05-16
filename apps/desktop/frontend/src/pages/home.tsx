import { Flex } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import HomeScreenIntro from "../components/homescreen/HomeScreenIntro";
import HomeScreenCoreValues from "../components/homescreen/HomeScreenCoreValues";
import HomeScreenFooter from "../components/homescreen/HomeScreenFooter";

function App() {
	return (
		<AppScreenLayout>
			<Flex direction={"column"}>
				<HomeScreenIntro />
				<HomeScreenCoreValues />
				<HomeScreenFooter />
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
