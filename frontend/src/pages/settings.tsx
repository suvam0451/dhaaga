import {
	Box,
	Button,
	Flex,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import {
	GetCustomDeviceId,
	GetDownloadsFolder,
	GetUserDataDirectory,
	SelectDownloadsFolder,
} from "../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import ClickToCopy from "../components/utils/ClickToCopy";
import ClickToChangeSettings from "../components/utils/ClickToChangeSettings";
import { UserSettingsService } from "../services/user-settings.service";

function App() {
	const [UserSettingsDownloadsDirectory, setUserSettingsDownloadsDirectory] =
		useState("");
	const [UserDataFolderPath, setUserDataFolderPath] = useState("");
	const [DeviceId, setDeviceId] = useState("");

	useEffect(() => {
		GetDownloadsFolder().then((res) => {
			setUserSettingsDownloadsDirectory(res);
		});
		GetUserDataDirectory().then((res) => {
			setUserDataFolderPath(res);
		});

		UserSettingsService.getCustomDeviceId().then((res) => {
			if (res) {
				setDeviceId(res);
			}
		});

		GetCustomDeviceId().then((res) => {
			setDeviceId(res);
		});
	}, []);

	async function onDownloadsFolderChangeClick() {
		const selectedPath = await SelectDownloadsFolder();
		setUserSettingsDownloadsDirectory(selectedPath);
	}

	async function onSaveCustomDeviceId() {
		return await UserSettingsService.setCustomDeviceId(DeviceId);
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
			<Flex my={"lg"} ml={"lg"} style={{ alignItems: "flex-end" }}>
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

			{/* Custom Device ID */}
			<Flex my={"lg"} ml={"lg"} style={{ alignItems: "flex-end" }}>
				<TextInput
					label={"Custom Device ID"}
					value={DeviceId}
					onChange={(e) => {
						setDeviceId(e.currentTarget.value);
					}}
				/>
				<Flex mx={"md"} style={{ alignItems: "center" }}>
					<ClickToCopy
						displayText="Path Copied!"
						copyText={DeviceId}
						size={24}
					/>
					<ClickToChangeSettings
						onClick={onSaveCustomDeviceId}
						successContent={"Updated!"}
						failureContent={"Failed to Update!"}
						buttonLabel={"Update"}
					/>
				</Flex>
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
