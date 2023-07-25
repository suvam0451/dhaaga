import { Box, Flex, Text, Image, Divider, Tabs } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { ColumnGeneratorProps } from "./columns.types";
import { useEffect, useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import {
	IconCheck,
	IconChevronLeft,
	IconCross,
	IconX,
} from "@tabler/icons-react";
import { mastodon } from "masto";
import MastadonPostListing from "../mastadon/PostListing";

function MastadonUserProfileColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [MastodonUserProfile, setMastodonUserProfile] =
		useState<mastodon.v1.Account | null>(null);
	const [MastodonUserStatuses, setMastodonUserStatuses] = useState<
		mastodon.v1.Status[] | null
	>(null);

	const [ActiveTab, setActiveTab] = useState<string | null>("posts");

	useEffect(() => {
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];
		if (!token) {
			console.log("token not found");
			return;
		}

		MastadonService.getUserProfile(
			account?.subdomain!,
			token,
			query.userId as unknown as string
		).then((res) => {
			setMastodonUserProfile(res);
		});

		MastadonService.getPostsForAccount(
			account?.subdomain!,
			token,
			query.userId as unknown as string
		).then((res) => {
			setMastodonUserStatuses(res);
		});
	}, []);

	useEffect(() => {
		console.log("statuses", MastodonUserStatuses);
	}, [MastodonUserStatuses]);

	return (
		<Flex direction={"column"}>
			{MastodonUserProfile && (
				<Flex pos={"relative"} direction={"column"}>
					<Box pos={"relative"} h={"92px"}>
						<Box bg={"red"} pos={"absolute"} miw={"360px"}>
							<Image fit="cover" src={MastodonUserProfile.header} />
						</Box>
						<Flex pos={"absolute"} style={{ zIndex: 99 }}>
							<IconChevronLeft />
							<Text>Discover</Text>
						</Flex>
					</Box>
					<Box px={"md"}>
						<Flex direction={"row"} justify={"space-between"}>
							<Box>
								<Box w={"64px"} h={"64px"}>
									<Image src={MastodonUserProfile.avatar} />
								</Box>
								<Text style={{ fontSize: 16, lineHeight: 1, fontWeight: 500 }}>
									{MastodonUserProfile.displayName}
								</Text>
								<Text
									style={{
										color: "#888",
										fontSize: 14,
									}}
								>
									@{MastodonUserProfile.username}
								</Text>
							</Box>
							<Box mt={"8px"}>
								<Box h={"32px"} />
								<Flex align={"center"} justify={"space-between"}>
									<Box>
										<Flex direction={"column"} align={"center"}>
											<Text style={{ fontWeight: 700, lineHeight: 1.25 }}>
												{MastodonUserProfile.followingCount}
											</Text>
											<Text style={{ fontSize: 12 }}>Following</Text>
										</Flex>
									</Box>
									<Box ml={"xs"}>
										<Flex direction={"column"} align={"center"}>
											<Text style={{ fontWeight: 700, lineHeight: 1.25 }}>
												{MastodonUserProfile.followersCount}
											</Text>
											<Text style={{ fontSize: 12 }}>Followers</Text>
										</Flex>
									</Box>
								</Flex>
							</Box>
						</Flex>

						<div
							style={{ color: "#888", fontSize: 14, lineHeight: 1.2 }}
							dangerouslySetInnerHTML={{ __html: MastodonUserProfile.note }}
						/>
						<Box
							px={"xs"}
							py={"0.25em"}
							bg={"#eee"}
							style={{ borderRadius: "xs" }}
						>
							{MastodonUserProfile.fields?.map((x, i) => (
								<Box key={i} mb={"xs"}>
									<Text style={{ fontSize: 15, fontWeight: 500 }}>
										{x.name}
									</Text>
									<Flex style={{ fontSize: 14 }} align={"center"}>
										{x.verifiedAt ? (
											<IconCheck
												style={{
													color: "green",
												}}
											/>
										) : (
											<></>
										)}
										<div
											style={{
												color: "#888",
												fontSize: 14,
												lineHeight: 1.2,
												textDecoration: "none",
											}}
											dangerouslySetInnerHTML={{ __html: x.value }}
										/>
									</Flex>
									{i === MastodonUserProfile.fields!.length - 1 ? (
										<></>
									) : (
										<Divider color={"#aaa"} mt={"xs"} />
									)}
								</Box>
							))}
						</Box>
						<Tabs value={ActiveTab} onTabChange={setActiveTab}>
							<Tabs.List grow>
								<Tabs.Tab value="posts">Posts</Tabs.Tab>
								<Tabs.Tab value="replies">Replies</Tabs.Tab>
								<Tabs.Tab value="boosts">Boosts</Tabs.Tab>
								<Tabs.Tab value="media">Media</Tabs.Tab>
							</Tabs.List>
							<Tabs.Panel value="posts">
								{MastodonUserStatuses?.map((o, i) => (
									<MastadonPostListing key={i} post={o} />
								))}
							</Tabs.Panel>
							<Tabs.Panel value="replies">Replies</Tabs.Panel>
							<Tabs.Panel value="boosts">Boosts</Tabs.Panel>
							<Tabs.Panel value="media">Media</Tabs.Panel>
						</Tabs>
					</Box>
				</Flex>
			)}
		</Flex>
	);
}

export default MastadonUserProfileColumn;
