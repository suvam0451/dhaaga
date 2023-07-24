import { Tabs, TextInput } from "@mantine/core";
import React from "react";

function MastadonDiscover() {
	return (
		<React.Fragment>
			<TextInput placeholder="Search users, posts and tags" />

			<Tabs defaultValue="first">
				<Tabs.List>
					<Tabs.Tab value="all">All</Tabs.Tab>
					<Tabs.Tab value="users">Users</Tabs.Tab>
					<Tabs.Tab value="tags">Tags</Tabs.Tab>
					<Tabs.Tab value="posts">Posts</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="all">First panel</Tabs.Panel>
				<Tabs.Panel value="users">Second panel</Tabs.Panel>
				<Tabs.Panel value="tags">Second panel</Tabs.Panel>

				<Tabs.Panel value="posts">Second panel</Tabs.Panel>
			</Tabs>
		</React.Fragment>
	);
}

export default MastadonDiscover;
