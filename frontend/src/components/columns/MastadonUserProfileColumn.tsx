import { Box, Flex, Text, Image, Divider, Tabs } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { ColumnGeneratorProps } from "./columns.types";
import { useEffect, useRef, useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import { mastodon } from "masto";
import AdvancedScrollArea from "../navigation/AdvancedScrollArea";
import MastadonAccountStatusesProvider from "../../contexts/MastadonAccountStatuses";
import PostRenderer from "./PostRenderer";
import {
	LatestTabRendererState,
} from "../../lib/redux/slices/latestTabRenderer";
import AdvancedScrollAreaProvider from "../../contexts/AdvancedScrollArea";
import MastadonProfileFields from "../mastadon/profile/MastadonProfileFields";
import DiscoverModuleBreadcrumbs from "../navigation/NavigationBreadcrumbs";

function MastadonUserProfileColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [MastodonUserProfile, setMastodonUserProfile] =
		useState<mastodon.v1.Account | null>(null);

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
	}, []);

	return (
		<Box>
			<DiscoverModuleBreadcrumbs index={index} />
			<MastadonAccountStatusesProvider query={query}>
				<AdvancedScrollAreaProvider>
					<AdvancedScrollArea>
						<Flex direction={"column"} w={410}>
							{MastodonUserProfile && (
								<Flex direction={"column"}>
									<Box
										pos={"relative"}
										h={"128px"}
		
										style={{ overflow: "clip" }}
									>
										<Box pos={"absolute"} style={{ overflow: "clip" }}>
											<Image
												fit="cover"
												bg={"gray"}
												src={MastodonUserProfile.header}
											/>
										</Box>
									</Box>
									<Box style={{ marginTop: "-32px" }} >
										<Flex mr={"md"} direction={"row"} justify={"space-between"}>
											<Box>
												<Box ml={"md"} w={"64px"} h={"64px"}>
													<Image src={MastodonUserProfile.avatar} />
												</Box>
												<Text
													style={{
														fontSize: 16,
														lineHeight: 1,
														fontWeight: 500,

													}}
												>
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
															<Text
																style={{ fontWeight: 700, lineHeight: 1.25 }}
															>
																{MastodonUserProfile.followingCount}
															</Text>
															<Text style={{ fontSize: 12 }}>Following</Text>
														</Flex>
													</Box>
													<Box ml={"xs"}>
														<Flex direction={"column"} align={"center"}>
															<Text
																style={{ fontWeight: 700, lineHeight: 1.25 }}
															>
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
											dangerouslySetInnerHTML={{
												__html: MastodonUserProfile.note,
											}}
										/>
										<MastadonProfileFields
											fields={MastodonUserProfile.fields}
										/>
										<Tabs value={ActiveTab} onTabChange={setActiveTab}>
											<Tabs.List grow>
												<Tabs.Tab value="posts">Posts</Tabs.Tab>
												<Tabs.Tab value="replies">Replies</Tabs.Tab>
												<Tabs.Tab value="boosts">Boosts</Tabs.Tab>
												<Tabs.Tab value="media">Media</Tabs.Tab>
											</Tabs.List>
											<Tabs.Panel value="posts">
												<PostRenderer />
											</Tabs.Panel>
											<Tabs.Panel value="replies">Replies</Tabs.Panel>
											<Tabs.Panel value="boosts">Boosts</Tabs.Panel>
											<Tabs.Panel value="media">Media</Tabs.Panel>
										</Tabs>
									</Box>
								</Flex>
							)}
						</Flex>
					</AdvancedScrollArea>
				</AdvancedScrollAreaProvider>
			</MastadonAccountStatusesProvider>
		</Box>
	);
}

export default MastadonUserProfileColumn;
