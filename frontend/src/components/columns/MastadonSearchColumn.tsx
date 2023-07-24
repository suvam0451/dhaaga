import { Box, Tabs, TextInput, Text, Flex } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { GetCredentialsByAccountId } from "../../../wailsjs/go/main/App";
import { KeystoreService } from "../../services/keystore.services";
import { MastadonService } from "../../services/mastadon.service";
import { useDebouncedValue } from "@mantine/hooks";
import { mastodon } from "masto";
import MastadonUserListing from "../mastadon/UserListing";
import MastadonTagListing from "../mastadon/TagListing";
import { ColumnGeneratorProps } from "./columns.types";
import { LatestTabRendererState } from "../../lib/redux/slices/latestTabRenderer";

/**
 * this column is the mastadon entrypoint for the
 * /v2/search featureset
 */
function MastadonSearchColumn({ index, query }: ColumnGeneratorProps) {
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);

	const [activeTab, setActiveTab] = useState<string | null>("all");
	const [SearchQuery, setSearchQuery] = useState("");
	const [MastodonAuth, setMastodonAuth] = useState<{
		instanceUrl: string;
		accessToken: string;
		profilePicUrl?: string;
		displayName?: string;
	} | null>(null);

	const [MastadonSearchResults, setMastadonSearchResults] =
		useState<mastodon.v2.Search>({
			accounts: [],
			statuses: [],
			hashtags: [],
		});

		
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

	useEffect(() => {
		if (debounced === "") return;

		MastadonService.search(
			MastodonAuth?.instanceUrl!,
			MastodonAuth?.accessToken!,
			debounced
		).then((res) => {
			setMastadonSearchResults(res);
		});
	}, [activeTab, debounced]);

	return (
		<Flex direction={"column"}>
			<TextInput
				value={SearchQuery}
				onChange={(e) => {
					setSearchQuery(e.currentTarget.value);
				}}
				placeholder="Search users, posts and tags"
			/>

			<Tabs value={activeTab} onTabChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="all">All</Tabs.Tab>
					<Tabs.Tab value="users">Users</Tabs.Tab>
					<Tabs.Tab value="tags">Tags</Tabs.Tab>
					<Tabs.Tab value="posts">Posts</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="all">First panel</Tabs.Panel>
				<Tabs.Panel value="users">
					<Box>
						{MastadonSearchResults.accounts.map((x) => (
							<MastadonUserListing user={x} />
						))}
					</Box>
				</Tabs.Panel>
				<Tabs.Panel value="tags">
					{MastadonSearchResults.hashtags.map((o, i) => (
						<MastadonTagListing key={i} tag={o} />
					))}
				</Tabs.Panel>

				<Tabs.Panel value="posts">Second panel</Tabs.Panel>
			</Tabs>
		</Flex>
	);
}

export default MastadonSearchColumn;
