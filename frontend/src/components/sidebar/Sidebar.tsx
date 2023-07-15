import { Navbar, ScrollArea } from "@mantine/core";
import React from "react";
import {
	IconGitPullRequest,
	IconAlertCircle,
	IconMessages,
	IconDatabase,
	IconSettings,
	IconSearch,
	IconHome,
} from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

interface MainLinkProps {
	icon: React.ReactNode;
	color: string;
	label: string;
}

function MainLink({ icon, color, label }: MainLinkProps) {
	return (
		<UnstyledButton
			sx={(theme) => ({
				display: "block",
				width: "100%",
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color:
					theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

				"&:hover": {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[6]
							: theme.colors.gray[0],
				},
			})}
		>
			<Group>
				<ThemeIcon color={color} variant="light">
					{icon}
				</ThemeIcon>

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

const data = [
	{
		icon: <IconGitPullRequest size="1rem" />,
		color: "blue",
		label: "Pull Requests",
	},
	{
		icon: <IconAlertCircle size="1rem" />,
		color: "teal",
		label: "Open Issues",
	},
	{ icon: <IconMessages size="1rem" />, color: "violet", label: "Discussions" },
	{ icon: <IconDatabase size="1rem" />, color: "grape", label: "Databases" },
];

export function MainLinks() {
	const links = data.map((link) => <MainLink {...link} key={link.label} />);
	return <div>{links}</div>;
}

function Sidebar() {
	return (
		<Navbar p="xs" h={"100%"} width={{ base: 240 }} pr={"md"}>
			<Navbar.Section>
				<Text>Prototype App</Text>
			</Navbar.Section>
			<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
				{/* scrollable content here */}
				<Link to="/home">
					<MainLink icon={<IconHome />} color={"#ddd"} label="Home" />
				</Link>
				<Link to="/search">
					<MainLink icon={<IconSearch />} color={"#ddd"} label="Search" />
				</Link>
				<Link to="/database">
					<MainLink
						icon={<IconDatabase color="rgb(238, 190, 250)" />}
						color={"rgba(156, 54, 181, 0.2)"}
						label="Gallery"
					/>
				</Link>
				<Link to="/settings">
					<MainLink icon={<IconSettings />} color={"#ddd"} label="Settings" />
				</Link>
			</Navbar.Section>
		</Navbar>
	);
}

export default Sidebar;
