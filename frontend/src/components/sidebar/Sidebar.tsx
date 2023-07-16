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
	IconPhotoStar,
	IconHeart,
	IconRss,
} from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { APP_MAX_HEIGHT } from "../../constants/app-dimensions";

interface MainLinkProps {
	icon: React.ReactNode;
	color: string;
	label: string;
}

const HIDE_DESKTOP_STYLE_BREAKPOINT = "(max-width: 48em) and (min-width: 20em)";
const HIDE_TABLET_STYLE_BREAKPOINT = "(min-width: 48em)";

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
			{/* Mobile */}
			{/* Tablet */}
			<MediaQuery
				query={HIDE_TABLET_STYLE_BREAKPOINT}
				styles={{ display: "none" }}
			>
				<Group>
					<ThemeIcon size={"xl"} color={color} variant="light">
						{icon}
					</ThemeIcon>
				</Group>
			</MediaQuery>

			{/* Desktop */}
			<MediaQuery
				query={HIDE_DESKTOP_STYLE_BREAKPOINT}
				styles={{ display: "none" }}
			>
				<Group>
					<ThemeIcon size={"lg"} color={color} variant="light">
						{icon}
					</ThemeIcon>
					<Text size="sm">{label}</Text>
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

const SIDEBAR_ICONS_ICON_COLOR_TABLET_MODE = "#aaa";
const SIDEBAR_ICONS_ICON_COLOR = "#888";
const SIDEBAR_ICONS_FOREGROUND_COLOR = "#ddd";

function Sidebar() {
	const SIDEBAR_BG_COLOR = "#eee";
	return (
		<Box
			mih={APP_MAX_HEIGHT}
			style={{
				zIndex: 99,
				boxShadow: "0.1px 0px 4px #888",
			}}
		>
			<MediaQuery
				query={HIDE_TABLET_STYLE_BREAKPOINT}
				styles={{ display: "none" }}
			>
				<Navbar width={{ base: 64 }} bg={SIDEBAR_BG_COLOR}>
					<Navbar.Section>
						<MainLink
							icon={<IconHome color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Home"
						/>
					</Navbar.Section>
					<Navbar.Section grow component={ScrollArea}>
						{/* scrollable content here */}
						<Link to="/home">
							<MainLink
								icon={<IconHome color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Home"
							/>
						</Link>
						<Link to="/search">
							<MainLink
								icon={<IconSearch color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Search"
							/>
						</Link>
						<Link to="/database">
							<MainLink
								icon={<IconDatabase color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Gallery"
							/>
						</Link>
					</Navbar.Section>
					<Navbar.Section>
						<Link to="/settings">
							<MainLink
								icon={<IconSettings color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Settings"
							/>
						</Link>
						<MainLink
							icon={<IconInfoCircle color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="About"
						/>
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
			<MediaQuery
				query={HIDE_DESKTOP_STYLE_BREAKPOINT}
				styles={{ display: "none" }}
			>
				<Navbar p="xs" h={"100%"} maw={{ base: 164 }} bg={SIDEBAR_BG_COLOR}>
					<Navbar.Section>
						<Text>Prototype App</Text>
					</Navbar.Section>
					<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
						{/* scrollable content here */}
						<Link to="/home">
							<MainLink
								icon={<IconHome color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Home"
							/>
						</Link>
						<Link to="/search">
							<MainLink
								icon={<IconSearch color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Search"
							/>
						</Link>
						<MainLink
							icon={<IconHeart color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Favourites"
						/>
						<MainLink
							icon={<IconRss color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Latest"
						/>
						<MainLink
							icon={<IconPhotoStar color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Gallery"
						/>
						<Link to="/database">
							<MainLink
								icon={<IconDatabase color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Database"
							/>
						</Link>
					</Navbar.Section>
					<Navbar.Section>
						<Link to="/settings">
							<MainLink
								icon={<IconSettings color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Settings"
							/>
						</Link>
						<MainLink
							icon={<IconInfoCircle color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="About"
						/>
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
		</Box>
	);
}

export default Sidebar;
