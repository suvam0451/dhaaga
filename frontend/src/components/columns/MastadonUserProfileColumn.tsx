import { Box, Flex, Image, LoadingOverlay, Tabs } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { ColumnGeneratorProps } from "./columns.types";
import { useEffect, useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import { mastodon } from "masto";
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

function MastadonUserProfileColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [MastodonUserProfile, setMastodonUserProfile] =
		useState<mastodon.v1.Account | null>(null);

	const [ActiveTab, setActiveTab] = useState<string | null>("posts");
	const [IsLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		const account = providerAuth.selectedAccount;
		const token = providerAuth.loggedInCredentials["accessToken"];

		if (!token) {
			console.log("token not found");
			setIsLoading(false);
			return;
		}

		MastadonService.getUserProfile(
			account?.subdomain!,
			token,
			query.userId as unknown as string
		)
			.then((res) => {
				setMastodonUserProfile(res);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return (
		<MastadonAccountStatusesProvider query={query}>
			<AdvancedScrollAreaProvider>
				<DiscoverModuleBreadcrumbs index={index} />
				<AdvancedScrollArea>
					<LoadingOverlay
						h={"100%"}
						visible={IsLoading}
						overlayBlur={2}
						transitionDuration={500}
						w={"100%"}
					/>
					<Flex h={"auto"} direction={"column"} w={COLUMN_MIN_WIDTH}>
						{MastodonUserProfile && (
							<Flex h={"auto"} direction={"column"}>
								<Box pos={"relative"} h={"128px"} style={{ overflow: "clip" }}>
									<Box
										pos={"absolute"}
										style={{ overflow: "clip", width: "100%", height: "100%" }}
									>
										{MastodonUserProfile.header &&
										!/original\/missing\.png/.test(
											MastodonUserProfile.header
										) ? (
											<Image
												fit="cover"
												alt={"No Background Cover"}
												src={MastodonUserProfile.header}
											/>
										) : (
											<Box
												bg={"#eee"}
												// src="//:0"
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
											<ProfileOwnerImage
												ml={"md"}
												src={MastodonUserProfile.avatar}
											/>
											<TextTitle lh={1}>
												{MastodonUserProfile.displayName}
											</TextTitle>
											<TextSubtitle>
												@{MastodonUserProfile.username}
											</TextSubtitle>
										</Box>
										<Box mt={"8px"}>
											<StatReportGrid>
												<StatReportItem>
													<StatReportMaintext>
														{MastodonUserProfile.followingCount}
													</StatReportMaintext>
													<StatReportSubtext>Following</StatReportSubtext>
												</StatReportItem>
												<StatReportItem>
													<StatReportMaintext>
														{MastodonUserProfile.followersCount}
													</StatReportMaintext>
													<StatReportSubtext>Followers</StatReportSubtext>
												</StatReportItem>
											</StatReportGrid>
										</Box>
									</Flex>

									<div
										style={{ color: "#888", fontSize: 14, lineHeight: 1.2 }}
										dangerouslySetInnerHTML={{
											__html: MastodonUserProfile.note,
										}}
									/>
									<MastadonProfileFields fields={MastodonUserProfile.fields} />
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
