import { Box, Button, Flex, Text, TextInput, Tooltip } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import {
	GetDownloadsFolder,
	GetUserDataDirectory,
	SelectDownloadsFolder,
} from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import ClickToCopy from "../components/utils/ClickToCopy";

function App() {
	const [UserSettingsDownloadsDirectory, setUserSettingsDownloadsDirectory] =
		useState("");
	const [UserDataFolderPath, setUserDataFolderPath] = useState("");

	useEffect(() => {
		GetDownloadsFolder().then((res) => {
			setUserSettingsDownloadsDirectory(res);
		});
		GetUserDataDirectory().then((res) => {
			setUserDataFolderPath(res);
		});
		// GetUserDa
	}, []);

	async function onDownloadsFolderChangeClick() {
		const selectedPath = await SelectDownloadsFolder();
		setUserSettingsDownloadsDirectory(selectedPath);
	}

	function onCopyClicked() {}

	return (
		<AppScreenLayout>
			<Text size={28} align="center" py={"lg"} fw="bold">
				Settings
			</Text>
			{/* Downloads Folder */}
			<Flex my={"lg"} ml={"lg"} style={{ alignItems: "flex-end" }}>
				<TextInput
					label={"Downloads Folder"}
					readOnly
					value={UserSettingsDownloadsDirectory}
					disabled
				/>
				<Flex mx={"md"} style={{ alignItems: "center" }}>
					<ClickToCopy
						displayText="Path Copied!"
						copyText={UserSettingsDownloadsDirectory}
						size={24}
					/>
					<Button mx={"sm"} onClick={onDownloadsFolderChangeClick}>
						Change
					</Button>
				</Flex>
			</Flex>

			{/* App Data Folder */}
			<Flex my={"lg"}  ml={"lg"} style={{ alignItems: "flex-end" }}>
				<TextInput
					label={"User Data Folder"}
					readOnly
					value={UserDataFolderPath}
					disabled
				/>
				<Flex mx={"md"} style={{ alignItems: "center" }}>
					<ClickToCopy
						displayText="Path Copied!"
						copyText={UserDataFolderPath}
						size={24}
					/>
					<Tooltip label="Edit not allowed" withArrow>
						<Box>
							<Button disabled mx={"sm"}>
								Change
							</Button>
						</Box>
					</Tooltip>
				</Flex>
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
