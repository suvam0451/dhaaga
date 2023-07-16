import { Navbar, ScrollArea, MediaQuery, Box } from "@mantine/core";
import React from "react";
import {
	IconGitPullRequest,
	IconAlertCircle,
	IconMessages,
	IconDatabase,
	IconSettings,
	IconSearch,
	IconHome,
	IconInfoCircle,
} from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { APP_MAX_HEIGHT } from "../../constants/app-dimensions";

interface MainLinkProps {
	icon: React.ReactNode;
	color: string;
	label: string;
}

function MainLink({ icon, color, label }: MainLinkProps) {
	return (
		<UnstyledButton
			w={"100%"}
			sx={(theme) => ({
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				"&:hover": {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[6]
							: theme.colors.gray[4],
				},
			})}
		>
			<MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
				<Group>
					<ThemeIcon size={"lg"} color={color} variant="light">
						{icon}
					</ThemeIcon>
					<Text size="sm">{label}</Text>
				</Group>
			</MediaQuery>
			<MediaQuery largerThan={"md"} styles={{ display: "none" }}>
				<Group>
					<ThemeIcon color={color} variant="light">
						{icon}
					</ThemeIcon>
				</Group>
			</MediaQuery>
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
	const SIDEBAR_BG_COLOR = "#eee";
	return (
		<Box mih={APP_MAX_HEIGHT} style={{ zIndex: 99 }}>
			<MediaQuery largerThan={"md"} styles={{ display: "none" }}>
				<Navbar p="xs" h={"100%"} width={{ base: 72 }} bg={SIDEBAR_BG_COLOR}>
					<Navbar.Section>
						<MainLink icon={<IconHome />} color={"#ddd"} label="Home" />
					</Navbar.Section>
					<Navbar.Section grow component={ScrollArea}>
						{/* scrollable content here */}
						<Link to="/home">
							<MainLink
								icon={<IconHome size={42} color="#ddd" />}
								color={"rgb(51, 154, 240)"}
								label="Home"
							/>
						</Link>
						<Link to="/search">
							<MainLink
								icon={<IconSearch color="rgb(238, 190, 250)" />}
								color={"#ddd"}
								label="Search"
							/>
						</Link>
						<Link to="/database">
							<MainLink
								icon={<IconDatabase color="rgb(238, 190, 250)" />}
								color={"rgba(156, 54, 181, 0.2)"}
								label="Gallery"
							/>
						</Link>
					</Navbar.Section>
					<Navbar.Section>
						<Link to="/settings">
							<MainLink
								icon={<IconSettings color="rgb(238, 190, 250)" />}
								color={"rgba(156, 54, 181, 0.2)"}
								label="Settings"
							/>
						</Link>
						<MainLink icon={<IconInfoCircle />} color={"#ddd"} label="Home" />
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
			<MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
				<Navbar p="xs" h={"100%"} maw={{ base: 200 }} bg={SIDEBAR_BG_COLOR}>
					<Navbar.Section>
						<Text>Prototype App</Text>
					</Navbar.Section>
					<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
						{/* scrollable content here */}
						<Link to="/home">
							<MainLink
								icon={<IconHome color={"#ddd"} />}
								color={"#777"}
								label="Home"
							/>
						</Link>
						<Link to="/search">
							<MainLink
								icon={<IconSearch color={"#ddd"} />}
								color={"#777"}
								label="Search"
							/>
						</Link>
						<MainLink
							icon={<IconDatabase color={"#ddd"} />}
							color={"#777"}
							label="Gallery"
						/>
						<Link to="/database">
							<MainLink
								icon={<IconDatabase color={"#ddd"} />}
								color={"#777"}
								label="Database"
							/>
						</Link>
					</Navbar.Section>
					<Navbar.Section>
						<Link to="/settings">
							<MainLink
								icon={<IconSettings color={"#ddd"} />}
								color={"#777"}
								label="Settings"
							/>
						</Link>
						<MainLink
							icon={<IconInfoCircle color={"#ddd"} />}
							color={"#777"}
							label="About"
						/>
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
		</Box>
	);
}

export default Sidebar;
