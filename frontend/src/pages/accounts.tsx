import { Box, Image, Flex, Select, Text, Tabs } from "@mantine/core";
import AppScreenLayout from "../layouts/AppScreenLayout";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
	GetAccoutsBySubdomain,
	GetSubdomainsForDomain,
} from "../../wailsjs/go/main/App";
import { IconGlobeOff } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/redux/store";
import {
	ProviderAuthState,
	providerAuthSlice,
} from "../lib/redux/slices/authSlice";

// icons
import MastadonLogo from "../assets/icons/Logo_Mastodon.svg";
import MetaLogo from "../assets/icons/Logo_Threads.svg";
import MisskeyLogo from "../assets/icons/Logo_Misskey.svg";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { TextSubtitle, TextTitle } from "../styles/Mastodon";
import { AuthProvider_SelectItem } from "../styles/App";
import MastadonOnboarding from "../components/onboarding/auth/Mastadon";
import MisskeyOnboarding from "../components/onboarding/auth/Misskey";
import ThreadsOnboarding from "../components/onboarding/auth/Threads";
import OnboardingProvider from "../contexts/OnboardingContext";
import AccountSelection from "../components/onboarding/accounts/AccountSelection";

interface Provider_selectItem_Props
	extends React.ComponentPropsWithoutRef<"div"> {
	value: string;
	label: string;
	displayName: string;
	icon: ReactJSXElement;
	description: string;
}

export const Provider_SelectItem = forwardRef<
	HTMLDivElement,
	Provider_selectItem_Props
>(
	(
		{
			value,
			displayName,
			icon,
			description,
			...others
		}: Provider_selectItem_Props,
		ref
	) => (
		<AuthProvider_SelectItem ref={ref} {...others}>
			<Box w={32} h={32}>
				{icon}
			</Box>
			<Flex direction={"column"} align={"flex-start"} ml={"md"}>
				<TextTitle>{displayName}</TextTitle>
				<TextSubtitle>{description}</TextSubtitle>
			</Flex>
		</AuthProvider_SelectItem>
	)
);

function App() {
	const dispatch = useDispatch<AppDispatch>();
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [Subdomains, setSubdomains] = useState<string[]>([]);

	useEffect(() => {
		if (!providerAuth.selectedDomain || !providerAuth.selectedSubDomain) return;

		GetAccoutsBySubdomain(
			providerAuth.selectedDomain,
			providerAuth.selectedSubDomain
		).then((res) => {
			dispatch(providerAuthSlice.actions.setAccounts(res));
		});
	}, [providerAuth.selectedDomain, providerAuth.selectedSubDomain]);

	function onProviderSelected(x: any) {
		dispatch(providerAuthSlice.actions.setSelectedDomain(x));
		GetSubdomainsForDomain(x).then((res) => {
			setSubdomains(res || []);
		});
	}

	function onNetworkSelected(x: any) {
		dispatch(providerAuthSlice.actions.setSelectedSubdomain(x));
	}

	const providers: Provider_selectItem_Props[] = [
		{
			value: "mastodon",
			label: "mastodon",
			displayName: "Mastodon",
			description: "Decentralized social network that's not for sale.",
			icon: <Image fit="contain" src={MastadonLogo} />,
		},
		{
			value: "misskey",
			label: "misskey",
			displayName: "Misskey",
			icon: <Image fit="contain" src={MisskeyLogo} />,
			description: "🌎 An interplanetary microblogging platform 🚀",
		},
		{
			value: "threads",
			label: "threads",
			displayName: "Threads",
			description: "A New Way to Share With Text. By Meta.",
			icon: <Image fit="contain" src={MetaLogo} />,
		},
	];

	const OnboardingComponentMapping = [
		{ key: "mastodon", value: MastadonOnboarding },
		{ key: "misskey", value: MisskeyOnboarding },
		{ key: "threads", value: ThreadsOnboarding },
	];

	const [SelectedSocialNetwork, setSelectedSocialNetwork] = useState<
		string | null
	>(null);

	const OnboardingComponent: () => React.JSX.Element = useMemo(
		() =>
			OnboardingComponentMapping.find((o) => o.key === SelectedSocialNetwork)
				?.value || (() => <></>),
		[SelectedSocialNetwork]
	);

	function socialNetworkSelected(e: any) {
		if (e.target.value === "") return;

		setSelectedSocialNetwork(e.target.value);
	}

	return (
		<AppScreenLayout>
			<Tabs
				pt={"lg"}
				bg={"rgba(248, 248, 248, 0.5)"}
				px={"1rem"}
				mt={"lg"}
				pb={"lg"}
				style={{ borderRadius: "0.25rem" }}
				miw={400}
				defaultValue={"select"}
			>
				<Tabs.List grow>
					<Tabs.Tab value="select">
						<Text style={{ fontWeight: 500, fontSize: 18 }}>
							Select an Account
						</Text>
					</Tabs.Tab>
					<Tabs.Tab value="create">
						<Text style={{ fontWeight: 500, fontSize: 18 }}>
							Add an Account
						</Text>
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="select" w={480}>
					<AccountSelection />
				</Tabs.Panel>

				<Tabs.Panel value="create" w={480}>
					<Box
						px={"1rem"}
						pt={"lg"}
						mt={"lg"}
						pb={"sm"}
						style={{ borderRadius: "0.25rem" }}
					>
						<Select
							w={"100%"}
							clearable
							data={providers}
							label="Select your social network platform"
							placeholder="Pick one"
							icon={<IconGlobeOff />}
							itemComponent={(e) => <Provider_SelectItem {...e} />}
							nothingFound="No results found..."
							filter={(value, item) =>
								item.value.toLowerCase().includes(value.toLowerCase().trim())
							}
							onSelect={socialNetworkSelected}
							styles={(theme) => ({
								item: {
									// applies styles to selected item
									"&[data-selected]": {
										"&, &:hover": {
											backgroundColor:
												theme.colorScheme === "dark"
													? theme.colors.gray[9]
													: theme.colors.blue[1],
											color:
												theme.colorScheme === "dark"
													? theme.white
													: theme.colors.gray[9],
										},
									},

									// applies styles to hovered item (with mouse or keyboard)
									"&[data-hovered]": {},
								},
							})}
						/>

						<OnboardingProvider>
							{OnboardingComponent !== undefined && <OnboardingComponent />}
						</OnboardingProvider>
					</Box>
				</Tabs.Panel>
			</Tabs>
			{/* 
			<Flex w={"100%"}>
				<Select
					style={{ flex: 1 }}
					mr={"xs"}
					label="Choose Provider"
					placeholder="Pick one"
					nothingFound="No results found..."
					data={[
						{ value: "meta", label: "Meta" },
						{ value: "mastodon", label: "Mastodon" },
					]}
					onChange={onProviderSelected}
				/>

				<Select
					style={{ flex: 1 }}
					ml={"xs"}
					label="Choose Network"
					placeholder="Pick one"
					nothingFound="No results found..."
					data={Subdomains}
					onChange={onNetworkSelected}
					disabled={providerAuth.selectedDomain === ""}
					error={
						Subdomains.length! > 0
							? null
							: "No networks currently available for this provider"
					}
				/>
			</Flex> */}

			{/* {providerAuth?.accounts.map((o, i) => (
				<Flex key={i} style={{ alignItems: "center" }} my={"xs"}>
					<TextInput disabled={true} value={o.username} />
					<TextInput
						disabled={true}
						value={o.password}
						mx={"xs"}
						type="password"
					/>
					{providerAuth.selectedAccount &&
					providerAuth.selectedAccount.id === o.id ? (
						<IconCheck color="green" size={32} />
					) : (
						<Button
							onClick={() => {
								dispatch(providerAuthSlice.actions.setSelectedAccount(o));
							}}
						>
							Select
						</Button>
					)}
				</Flex>
			))} */}
			{/* <MetaThreadsAddAccount />
			<AddAccountMastadon /> */}
		</AppScreenLayout>
	);
}

export default App;
