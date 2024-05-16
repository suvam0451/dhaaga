import { Box, Flex, Image, LoadingOverlay, Tabs } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { ColumnGeneratorProps } from "./columns.types";
import { useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import AdvancedScrollArea from "../navigation/AdvancedScrollArea";
import MastadonAccountStatusesProvider from "../../contexts/MastadonAccountStatuses";
import PostRenderer from "./PostRenderer";
import AdvancedScrollAreaProvider from "../../contexts/AdvancedScrollArea";
import MastadonProfileFields from "../mastadon/profile/MastadonProfileFields";
import DiscoverModuleBreadcrumbs from "../navigation/NavigationBreadcrumbs";
import { COLUMN_MIN_WIDTH } from "../../constants/app-dimensions";
import {
	ProfileOwnerImage,
	StatReportGrid,
	StatReportItem,
	StatReportMaintext,
	StatReportSubtext,
	TextSubtitle,
	TextTitle,
} from "../../styles/Mastodon";
import { useQuery } from "@tanstack/react-query";

function MastadonUserProfileColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [ActiveTab, setActiveTab] = useState<string | null>("posts");

	function fetchProfile(query: string) {
		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		if (!token) return Promise.reject(new Error("token not found"));
		return MastadonService.getUserProfile(account?.subdomain!, token, query);
	}

	const { status, data } = useQuery({
		queryKey: ["mastodon/v1/account", query.userId],
		queryFn: () => fetchProfile(query.userId as unknown as string),
	});

	return (
		<MastadonAccountStatusesProvider query={query}>
			<AdvancedScrollAreaProvider>
				<DiscoverModuleBreadcrumbs index={index} />
				<AdvancedScrollArea>
					<LoadingOverlay
						h={"100%"}
						visible={status === "pending"}
						overlayBlur={2}
						transitionDuration={500}
						w={"100%"}
					/>
					<Flex h={"auto"} direction={"column"} w={COLUMN_MIN_WIDTH}>
						{data && (
							<Flex h={"auto"} direction={"column"}>
								<Box pos={"relative"} h={"128px"} style={{ overflow: "clip" }}>
									<Box
										pos={"absolute"}
										style={{ overflow: "clip", width: "100%", height: "100%" }}
									>
										{data.header &&
										!/original\/missing\.png/.test(data.header) ? (
											<Image
												fit="cover"
												alt={"No Background Cover"}
												src={data.header}
											/>
										) : (
											<Box
												bg={"#eee"}
												style={{
													height: "100%",
													width: "100%",
												}}
											/>
										)}
									</Box>
								</Box>
								<Box>
									<Flex justify={"space-between"}>
										<Box>
											<ProfileOwnerImage ml={"md"} src={data.avatar} />
											<TextTitle lh={1}>{data.displayName}</TextTitle>
											<TextSubtitle>@{data.username}</TextSubtitle>
										</Box>
										<Box mt={"8px"}>
											<StatReportGrid>
												<StatReportItem>
													<StatReportMaintext>
														{data.followingCount}
													</StatReportMaintext>
													<StatReportSubtext>Following</StatReportSubtext>
												</StatReportItem>
												<StatReportItem>
													<StatReportMaintext>
														{data.followersCount}
													</StatReportMaintext>
													<StatReportSubtext>Followers</StatReportSubtext>
												</StatReportItem>
											</StatReportGrid>
										</Box>
									</Flex>

									<div
										style={{ color: "#888", fontSize: 14, lineHeight: 1.2 }}
										dangerouslySetInnerHTML={{
											__html: data.note,
										}}
									/>
									<MastadonProfileFields fields={data.fields} />
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
	);
}

export default MastadonUserProfileColumn;
