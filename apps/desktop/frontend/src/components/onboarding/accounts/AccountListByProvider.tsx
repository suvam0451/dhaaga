import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../lib/redux/store";
import {
	ProviderAuthItem,
	providerAuthSlice,
} from "../../../lib/redux/slices/authSlice";
import {
	GetAccountsByDomain,
	GetCredentialsByAccountId,
} from "../../../../wailsjs/go/main/App";
import { useEffect, useState } from "react";
import { threadsdb } from "../../../../wailsjs/go/models";
import { Box, Flex, Image } from "@mantine/core";
import {
	ProfilePicSearchResult,
	TextSubtitle,
	TextTitle,
} from "../../../styles/Mastodon";
import { HighlightOnHover } from "../../../styles/App";
import { IconCheck, IconDots } from "@tabler/icons-react";

type AccountWithCredentials = threadsdb.ThreadsDb_Account & {
	credentials?: threadsdb.ThreadsDb_Credential[];
};
function AccountListByProvider({ domain }: { domain: string }) {
	const dispatch = useDispatch<AppDispatch>();
	const [AccountList, setAccountList] = useState<AccountWithCredentials[]>([]);

	function onItemSelect(o: ProviderAuthItem) {
		dispatch(providerAuthSlice.actions.setSelectedAccount(o));
	}

	useEffect(() => {
		GetAccountsByDomain(domain).then(async (accs) => {
			if (accs) {
				const results: AccountWithCredentials[] = [];
				for await (const acct of accs) {
					await GetCredentialsByAccountId(acct.id).then((creds) => {
						results.push({
							...acct,
							credentials: creds,
						});
					});
				}
				setAccountList(results);
			} else {
				setAccountList([]);
			}
		});
	}, []);

	useEffect(() => {
		console.log(AccountList);
	}, [AccountList]);

	function arrayToObject(items: threadsdb.ThreadsDb_Credential[]) {
		const record: Record<string, string> = {};
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			record[element.credential_type] = element.credential_value;
		}
		return record;
	}
	return (
		<Box ml={"md"}>
			{AccountList.map((o, i) => (
				<HighlightOnHover key={i}>
					<ProfilePicSearchResult>
						{o.credentials?.find(
							(o) => o.credential_type === "profile_pic_url"
						) ? (
							<Image
								src={
									o.credentials?.find(
										(o) => o.credential_type === "profile_pic_url"
									)?.credential_value
								}
							/>
						) : (
							<Box></Box>
						)}{" "}
					</ProfilePicSearchResult>
					<Flex direction={"column"} ml={"md"} style={{ flexGrow: 1 }}>
						<TextTitle>@{o.username}</TextTitle>
						<TextSubtitle>{o.subdomain}</TextSubtitle>
					</Flex>
					<Flex style={{ flexShrink: 1 }}>
						<IconCheck
							onClick={() =>
								onItemSelect({
									...o,
									credentials: arrayToObject(o.credentials!),
								})
							}
							size={32}
							style={{ margin: "0px 10px" }}
						/>
						<IconDots size={32} />
					</Flex>
				</HighlightOnHover>
			))}
		</Box>
	);
}

export default AccountListByProvider;
