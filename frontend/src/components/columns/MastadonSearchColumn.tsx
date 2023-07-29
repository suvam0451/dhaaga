import { Box, Tabs, TextInput, Flex, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { GetCredentialsByAccountId } from "../../../wailsjs/go/main/App";
import { KeystoreService } from "../../services/keystore.services";
import { MastadonService } from "../../services/mastadon.service";
import { useDebouncedValue } from "@mantine/hooks";
import MastadonUserListing from "../mastadon/UserListing";
import MastadonTagListing from "../mastadon/TagListing";
import { ColumnGeneratorProps } from "./columns.types";
import DiscoverModuleBreadcrumbs from "../navigation/NavigationBreadcrumbs";
import AdvancedScrollAreaProvider from "../../contexts/AdvancedScrollArea";
import AdvancedScrollArea from "../navigation/AdvancedScrollArea";
import { COLUMN_MIN_WIDTH } from "../../constants/app-dimensions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MastadonPostListing from "../mastadon/PostListing";

/**
 * this column is the mastadon entrypoint for the
 * /v2/search featureset
 */
function MastadonSearchColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [activeTab, setActiveTab] = useState<string | null>("all");
	const [SearchQuery, setSearchQuery] = useState("");
	const [MastodonAuth, setMastodonAuth] = useState<{
		instanceUrl: string;
		accessToken: string;
		profilePicUrl?: string;
		displayName?: string;
	} | null>(null);

	useEffect(() => {
		if (!providerAuth.selectedAccount) return;
		GetCredentialsByAccountId(providerAuth.selectedAccount!.id).then((res) => {
			const { success, data } = KeystoreService.verifyMastadonCredentials(
				providerAuth.selectedAccount?.subdomain!,
				res
			);
			if (success) {
				setMastodonAuth(data!);
			}
		});
	}, [providerAuth.selectedAccount]);

	const [debounced] = useDebouncedValue(SearchQuery, 200);

	function mastodonSearch(term: string) {
		if (term === "")
			return Promise.resolve({
				accounts: [],
				statuses: [],
				hashtags: [],
			});
		return MastadonService.search(
			MastodonAuth?.instanceUrl!,
			MastodonAuth?.accessToken!,
			debounced
		);
	}

	const { status, data } = useQuery({
		queryKey: ["mastodon/v2/search", debounced],
		queryFn: () => mastodonSearch(debounced),
	});

	return (
		<AdvancedScrollAreaProvider>
			<DiscoverModuleBreadcrumbs index={index} />
			<AdvancedScrollArea>
				<Flex direction={"column"} h={"auto"} miw={COLUMN_MIN_WIDTH}>
					<TextInput
						value={SearchQuery}
						onChange={(e) => {
							setSearchQuery(e.currentTarget.value);
						}}
						placeholder="Search users, posts and tags"
					/>

					<Tabs value={activeTab} onTabChange={setActiveTab} h={"100%"}>
						<Tabs.List>
							<Tabs.Tab value="all">All</Tabs.Tab>
							<Tabs.Tab value="users">Users</Tabs.Tab>
							<Tabs.Tab value="tags">Tags</Tabs.Tab>
							<Tabs.Tab value="posts">Posts</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="all">First panel</Tabs.Panel>
						<Tabs.Panel
							value="users"
							h={"100%"}
							style={{ position: "relative" }}
						>
							<LoadingOverlay
								h={"100%"}
								visible={status === "pending"}
								overlayBlur={2}
								transitionDuration={500}
							/>
							<Box h={"100%"}>
								{data &&
									data.accounts.map((x, i) => (
										<MastadonUserListing key={i} user={x} />
									))}
							</Box>
						</Tabs.Panel>
						<Tabs.Panel value="tags">
							{data &&
								data.hashtags.map((o, i) => (
									<MastadonTagListing key={i} tag={o} />
								))}
						</Tabs.Panel>
						<Tabs.Panel value="posts">
							{data &&
								data.statuses.map((o, i) => <MastadonPostListing key={i} post={o!} />)}
						</Tabs.Panel>
					</Tabs>
				</Flex>
			</AdvancedScrollArea>
		</AdvancedScrollAreaProvider>
	);
}

export default MastadonSearchColumn;
