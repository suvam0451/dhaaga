import {
	Navbar,
	ScrollArea,
	MediaQuery,
	Box,
	Flex,
	Divider,
} from "@mantine/core";
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
import { useLocation } from "react-router-dom";

interface MainLinkProps {
	icon: React.ReactNode;
	color: string;
	label: string;
	pathname: string;
}

const HIDE_DESKTOP_STYLE_BREAKPOINT = "(max-width: 48em) and (min-width: 20em)";
const HIDE_TABLET_STYLE_BREAKPOINT = "(min-width: 48em)";

const SIDEBAR_BG_COLOR = "#eee";

function MainLink({ icon, color, label, pathname }: MainLinkProps) {
	const selected = useLocation().pathname === pathname;
	return (
		<Link to={pathname}>
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
				bg={selected ? "#ccc" : SIDEBAR_BG_COLOR}
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
		</Link>
	);
}

const SIDEBAR_ICONS_ICON_COLOR_TABLET_MODE = "#aaa";
const SIDEBAR_ICONS_ICON_COLOR = "#888";
const SIDEBAR_ICONS_FOREGROUND_COLOR = "#ddd";

function Sidebar() {
	const location = useLocation();

	return (
		<Box
			mih={APP_MAX_HEIGHT}
			style={{
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
							pathname="/home"
						/>
					</Navbar.Section>
					<Navbar.Section grow component={ScrollArea}>
						{/* scrollable content here */}
						<Link to="/home">
							<MainLink
								icon={<IconHome color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Home"
								pathname="/home"
							/>
						</Link>
						<Link to="/search">
							<MainLink
								icon={<IconSearch color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Search"
								pathname="/search"
							/>
						</Link>
						<Link to="/database">
							<MainLink
								icon={<IconDatabase color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Gallery"
								pathname="/database"
							/>
						</Link>
					</Navbar.Section>
					<Navbar.Section>
						<Link to="/settings">
							<MainLink
								icon={<IconSettings color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
								color={SIDEBAR_ICONS_ICON_COLOR}
								label="Settings"
								pathname="/settings"
							/>
						</Link>
						<MainLink
							icon={<IconInfoCircle color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="About"
							pathname="/about"
						/>
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
			<MediaQuery
				query={HIDE_DESKTOP_STYLE_BREAKPOINT}
				styles={{ display: "none" }}
			>
				<Navbar p="xs" h={"100%"} w={{ base: 164 }} bg={SIDEBAR_BG_COLOR}>
					<Navbar.Section>
						<Flex style={{ alignItems: "flex-end" }}>
							<Text size={42} style={{ fontWeight: 500 }}>
								धागा
							</Text>
							<Text size={16}>Dhaaga</Text>
						</Flex>
					</Navbar.Section>
					<Divider my={"sm"} />
					<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
						{/* scrollable content here */}
						<MainLink
							icon={<IconHome color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Home"
							pathname="/home"
						/>
						<MainLink
							icon={<IconSearch color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label={"Search"}
							pathname={"/search"}
						/>
						<MainLink
							icon={<IconHeart color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Favourites"
							pathname="/favourites"
						/>
						<MainLink
							icon={<IconRss color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Latest"
							pathname="/latest"
						/>
						<MainLink
							icon={<IconPhotoStar color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Gallery"
							pathname="/gallery"
						/>
						<MainLink
							icon={<IconDatabase color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Database"
							pathname="/database"
						/>
					</Navbar.Section>
					<Navbar.Section>
						<MainLink
							icon={<IconSettings color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="Settings"
							pathname="/settings"
						/>
						<MainLink
							icon={<IconInfoCircle color={SIDEBAR_ICONS_FOREGROUND_COLOR} />}
							color={SIDEBAR_ICONS_ICON_COLOR}
							label="About"
							pathname="/about"
						/>
					</Navbar.Section>
				</Navbar>
			</MediaQuery>
		</Box>
	);
}

export default Sidebar;
