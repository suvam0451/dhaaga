import { Box, Flex, Tabs, Image, Text } from "@mantine/core";
// icons
import MastodonLogo from "../../../assets/icons/Logo_Mastodon.svg";
import MetaLogo from "../../../assets/icons/Logo_Threads.svg";
import MisskeyLogo from "../../../assets/icons/Logo_Misskey.svg";
import AccountListByProvider from "./AccountListByProvider";

/**
 * Helps user activate an existing account
 * @returns
 */
function AccountSelection() {
	return (
		<Tabs
			my={"lg"}
			defaultValue="mastodon"
			orientation="vertical"
			w={"100%"}
		>
			<Tabs.List>
				<Tabs.Tab value="mastodon">
					<Flex>
						<Box w={24} h={24}>
							<Image fit="contain" src={MastodonLogo} />
						</Box>
						<Text ml={"6px"}>Mastodon</Text>
					</Flex>
				</Tabs.Tab>
				<Tabs.Tab value="misskey">
					<Flex>
						<Box w={24} h={24}>
							<Image fit="contain" src={MisskeyLogo} />
						</Box>
						<Text ml={"6px"}>Misskey</Text>
					</Flex>
				</Tabs.Tab>
				<Tabs.Tab value="threads">
					<Flex>
						<Box w={24} h={24}>
							<Image fit="contain" src={MetaLogo} />
						</Box>
						<Text ml={"6px"}>Threads</Text>
					</Flex>
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="mastodon">
				<AccountListByProvider domain="mastodon" />
			</Tabs.Panel>
			<Tabs.Panel value="misskey">

        <AccountListByProvider domain="misskey"/>
      </Tabs.Panel>
			<Tabs.Panel value="settings">
        <AccountListByProvider domain="meta" />

      </Tabs.Panel>
		</Tabs>
	);
}

export default AccountSelection;
