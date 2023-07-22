import { Text } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import TaskManager from "../components/tasks/TaskManager";

function App() {
	return (
		<AppScreenLayout>
			<TaskManager/>
      {/* <Text> Page</Text> */}
		</AppScreenLayout>
	);
}

export default App;
