import { Text } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import ThreadsUserTable from "../components/tables/ThreadsUsersTable";

function App() {
	return (
		<AppScreenLayout>
			<Text size={28} align="center" py={"lg"} fw="bold">
				Discover Users
			</Text>
			<ThreadsUserTable />
		</AppScreenLayout>
	);
}

export default App;
