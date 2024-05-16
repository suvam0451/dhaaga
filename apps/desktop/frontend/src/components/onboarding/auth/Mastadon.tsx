import {
	TextInput,
	Text,
	Select,
	Button,
	Box,
	Flex,
	Loader,
	Drawer,
} from "@mantine/core";
import { MastadonWorker } from "../../../services/mastadon-worker.service";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { MastadonService } from "../../../services/mastadon.service";
import ClickToPaste from "../../utils/ClickToPaste";
import { TextTitle } from "../../../styles/Mastodon";
import { useOnboardingProviderHook } from "../../../contexts/OnboardingContext";
import LoadingStepTemplate from "./LoadingStepTemplate";

function MastadonOnboarding() {
	const { store, dispatch } = useOnboardingProviderHook();

	const [AuthToken, setAuthToken] = useState("");

	const [IsDrawerProcessing, setIsDrawerProcessing] = useState(false);
	const [MastadonServerURL, setMastadonServerURL] = useState("");
	const [DrawerOpen, setDrawerOpen] = useState(false);
	const [Step, setStep] = useState(0);

	async function onLoginAttempted() {
		setStep(1);
		const serverUrl = MastadonServerURL;
		MastadonService.fetchCode(serverUrl);
	}

	function closeDrawer() {
		setDrawerOpen(false);
	}

	async function onVerificationStart() {
		setIsDrawerProcessing(true);
		dispatch.setLoading(true);
		try {
			const res = await MastadonService.verifyAccessToken(
				MastadonServerURL,
				AuthToken
			);

			if (!res) {
				dispatch.setLoading(false);
				setIsDrawerProcessing(false);
				notifications.show({
					id: "mastadon-auth-failure",
					color: "red",
					title: "Could not log in",
					message: `[ERROR]: possibly pasted token was incorrect`,
					icon: <IconX />,
					autoClose: 10000,
				});
				return;
			}

			const obj = await MastadonService.verifyCredentials(
				MastadonServerURL,
				res
			);
			if (!obj) {
				dispatch.setLoading(false);
				setIsDrawerProcessing(false);
				notifications.show({
					id: "mastadon-auth-failure",
					color: "red",
					title: "Could not log in",
					message: `[ERROR]: failed to obtain profile data.`,
					icon: <IconX />,
					autoClose: 10000,
				});
				return;
			}
			const { success: onboardSuccess, error: onboardError } =
				await MastadonWorker.onboardUser(MastadonServerURL, obj);

			if (!onboardSuccess) {
				dispatch.setLoading(false);
				notifications.show({
					id: "mastadon-auth-failure",
					color: "red",
					title: "Could not log in",
					message: `[ERROR]: ${onboardError}`,
					icon: <IconX />,
					autoClose: 10000,
				});
			} else {
				dispatch.setLoading(false);
				setStep(2);
				notifications.show({
					id: "mastadon-auth-success",
					color: "teal",
					title: "Account Updated Successfully",
					message: (
						<Text>
							You can now log into <b>{MastadonServerURL}</b> as{" "}
							<b>{obj.username}</b>
						</Text>
					),
					icon: <IconCheck />,
					autoClose: 5000,
				});
			}
		} finally {
			dispatch.setLoading(false);
			setIsDrawerProcessing(false);
			setDrawerOpen(false);
		}
	}

	return (
		<Box>
			<LoadingStepTemplate
				label="Step 1/3: Select your Mastadon server"
				hidden={false}
				buttonDisabled={Step > 0 || store.loading}
				onClick={onLoginAttempted}
			>
				<Select
					disabled={Step > 0 || store.loading}
					searchable
					clearable
					onSearchChange={setMastadonServerURL}
					style={{ flexGrow: 1 }}
					placeholder="https://mastodon.social"
					data={popularMastadonServers}
					filter={(value, item) =>
						item.url.toLowerCase().includes(value.toLowerCase().trim())
					}
				/>
				<TextInput
					disabled
					value={"/oauth/authorize"}
					style={{ flexShrink: 1 }}
					mx={"md"}
					maw={148}
				/>
			</LoadingStepTemplate>

			<LoadingStepTemplate
				label="Step 2/3: Paste your token here"
				hidden={Step < 1}
				buttonDisabled={Step > 1 || store.loading}
				onClick={onVerificationStart}
			>
				<TextInput
					data-autofocus
					placeholder="Paste token obtained from browser here..."
					miw={"lg"}
					value={AuthToken}
					style={{ flexGrow: 1 }}
					onChange={(e) => {
						setAuthToken(e.currentTarget.value);
					}}
					disabled={Step > 1 || store.loading}
				/>
				<ClickToPaste
					callback={() => {
						navigator.clipboard.readText().then((text) => {
							setAuthToken(text);
						});
					}}
					displayText="Pasted clipboard content !"
					size={32}
				/>
			</LoadingStepTemplate>
			<LoadingStepTemplate
				label=""
				hidden={Step < 2}
				buttonDisabled={Step > 2 || store.loading}
				onClick={() => {}}
			>
				<Text
					style={{
						fontWeight: 500,
						flexGrow: 1,
					}}
				>
					Step 3/3: Congratulations! You are all set 🎉
				</Text>
			</LoadingStepTemplate>
			{/* {Step > 1 && (
				<Flex w={"100%"} align={"center"}>
					<TextTitle my={"md"} style={{ flexGrow: 1 }}>
						Step 3: Congratulations! You are all set 🎉
					</TextTitle>
					<Button style={{ flexShrink: 1 }}>Close</Button>
				</Flex>
			)} */}
		</Box>
	);
}

const popularMastadonServers = [
	{
		value: "https://mastodon.social",
		label: "https://mastodon.social",
		displayname: "Mastadon",
		url: "https://mastodon.social",
		nsfw: false,
	},
	{
		value: "https://baraag.net",
		label: "https://baraag.net",
		displayname: "🔞 baraag.net",
		url: "https://baraag.net",
		nsfw: true,
	},
	{
		value: "https://mstdn.social",
		label: "https://mstdn.social",
		displayname: "Mastodon 🐘",
		url: "https://mstdn.social",
		nsfw: false,
	},
	{
		value: "https://pawoo.net",
		label: "https://pawoo.net",
		displayname: "Pawoo",
		url: "https://pawoo.net",
		nsfw: false,
		languages: ["jp"],
	},
	{
		value: "https://mstdn.jp",
		label: "https://mstdn.jp",
		displayname: "mstdn.jp",
		url: "https://mstdn.jp",
		nsfw: false,
		languages: ["jp"],
	},
];

export default MastadonOnboarding;
