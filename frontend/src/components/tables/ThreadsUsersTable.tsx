import {
	Box,
	Button,
	Flex,
	Menu,
	Pagination,
	Popover,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import {
	IconArrowsLeftRight,
	IconCheck,
	IconCopy,
	IconHeart,
	IconInfoCircle,
	IconMessageCircle,
	IconPhoto,
	IconSearch,
	IconSettings,
	IconTrash,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { DiscoverSearchState } from "../../lib/redux/slices/discoverSearchSlice";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getDashboardSearchResults } from "../../lib/redux/slices/workerSlice";
import { ThreadsUser } from "./tables.types";
import { AvatarBase64Loader } from "../variants/search-recommendations/threadsDesktop";
import { TABLE_FIXED_WIDTH } from "../../constants/app-dimensions";
import UserFavouriteController from "./utils/FavouriteUser";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { GetCredentialsByAccountId } from "../../../wailsjs/go/main/App";
import { KeystoreService } from "../../services/keystore.services";
import { UserSettingsService } from "../../services/user-settings.service";
import { TaskState, taskSlice } from "../../lib/redux/slices/tasksSlice";
import { notifications } from "@mantine/notifications";

function CopyUsername({ text }: { text: string }) {
	const dispatch = useDispatch<AppDispatch>();
	const tasks = useSelector<RootState, TaskState>((o) => o.tasks);

	const [opened, setOpened] = useState(false);
	const [CopyText, setCopyText] = useState<string>(text);
	const discover = useSelector<RootState, DiscoverSearchState>(
		(o) => o.threadsDiscover
	);
	useEffect(() => {
		setCopyText("Copied!");
	}, [setCopyText]);

	function copyRequested() {
		setOpened(true);
		navigator.clipboard.writeText(`https://www.threads.net/@${text}`);
		setTimeout(() => {
			setOpened(false);
		}, 750);
	}
	return (
		<Flex style={{ alignItems: "center" }}>
			{/* FIXME: This is not working */}
			{/* <HighlightedPartialMatch text={text} searchTerm={discover.query.searchTerm} /> */}
			<Box>{text}</Box>
			<Flex mx={"xs"}>
				<Popover opened={opened}>
					<Popover.Target>
						<Flex style={{ alignItems: "center" }}>
							<IconCopy color="#888" size={20} onClick={copyRequested} />
						</Flex>
					</Popover.Target>
					<Popover.Dropdown>
						<Flex>
							<IconCheck color="green" />
							<Text>Copied!</Text>
						</Flex>
					</Popover.Dropdown>
				</Popover>
			</Flex>
		</Flex>
	);
}

function ThreadsUserTable() {
	const dispatch = useDispatch<AppDispatch>();
	const discover = useSelector<RootState, DiscoverSearchState>(
		(o) => o.threadsDiscover
	);
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);

	const [SearchTerm, setSearchTerm] = useState<string>("");
	const [debounced] = useDebouncedValue(SearchTerm || "", 200);

	function onSearchClick() {}

	// Reset the offset (pagination) when the search term changes
	useEffect(() => {
		dispatch({
			type: "setDashboardOffset",
			payload: 0,
		});
	}, [debounced]);

	// Fetch the discovery results when the search term/query changes
	useEffect(() => {
		dispatch(
			getDashboardSearchResults({
				query: debounced,
				limit: discover.query.limit,
				offset: discover.query.offset,
				favouritedOnly: discover.query.favouritesOnly,
			})
		);
	}, [debounced, discover.query]);

	async function onMenuItemTimelineGetClick(pk: string) {
		if (!providerAuth.selectedAccount) return;

		const creds = await GetCredentialsByAccountId(
			providerAuth.selectedAccount.id
		);
		const deviceID = await UserSettingsService.getCustomDeviceId();

		const { success: validCredSuccess, data: validCreds } =
			await KeystoreService.verifyMetaThreadsCredentials(creds);
		if (!validCredSuccess || !deviceID) return;

		const taskDefition = {
			access_token: validCreds?.accessToken,
			user_id: pk,
		};

		dispatch(
			taskSlice.actions.createTask({
				domain: "meta",
				subdomain: "threads",
				taskDetails: taskDefition,
				loginAs: providerAuth.selectedAccount,
			})
		);

		notifications.show({
			title: "Timeline Sync Task Added",
			message: "Switch to tasks tab to start processing this task! 🤥",
		});
	}

	const rows = discover?.searchResults?.items?.map((o: ThreadsUser, i) => (
		<tr key={o.pk}>
			<td>{o.pk}</td>
			<td>
				<CopyUsername text={o.username} />
			</td>
			<td>
				<AvatarBase64Loader url={o.profile_pic_url} />
			</td>

			<td>{o.FollowerCount}</td>
			<td>
				<UserFavouriteController pk={o.pk} favourited={o.FavouritedLocal} />
			</td>
			<td>
				<Menu shadow="md" width={200}>
					<Menu.Target>
						<Button disabled={!providerAuth.selectedAccount} size={"sm"}>
							Actions
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Logged In Actions</Menu.Label>
						<Menu.Item
							icon={<IconPhoto size={14} />}
							onClick={() => {
								onMenuItemTimelineGetClick(o.pk);
							}}
						>
							Sync Posts
						</Menu.Item>
						<Menu.Divider />

						<Menu.Label>Danger zone</Menu.Label>
						<Menu.Item icon={<IconArrowsLeftRight size={14} />}>
							Clear Data
						</Menu.Item>
						<Menu.Item color="red" icon={<IconTrash size={14} />}>
							Remove Account
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</td>
		</tr>
	));

	function setPage(ans: number) {
		dispatch({
			type: "setDashboardOffset",
			payload: (ans - 1) * 5,
		});
	}

	function onInputChange(e: any) {
		setSearchTerm(e.target.value);
	}

	function onFavouritesToggle() {
		dispatch({
			type: "setDashboardFavouritesOnly",
			payload: !discover.query.favouritesOnly,
		});
	}

	return (
		<Box w={TABLE_FIXED_WIDTH}>
			<Flex w={"100%"} style={{ alignItems: "center" }}>
				<Box
					style={{ flexGrow: 1, width: "100%s", display: "flex" }}
					pr={"md"}
					my={"md"}
				>
					<TextInput
						style={{ flexGrow: 1 }}
						onChange={onInputChange}
						placeholder="Search for an item"
					/>
					<Button mx="md" onClick={onSearchClick}>
						Go
					</Button>
				</Box>

				<Box onClick={onFavouritesToggle}>
					<Tooltip label="Favourites Only" withArrow>
						<IconHeart
							size={32}
							color={discover.query.favouritesOnly ? "red" : "#888"}
						/>
					</Tooltip>
				</Box>
			</Flex>

			<Table highlightOnHover withBorder withColumnBorders striped>
				<thead>
					<tr>
						<th>Pk</th>
						<th>Username</th>
						<th>PFP</th>
						<th>Followers</th>
						<th>
							<Flex style={{ alignItems: "center" }}>
								<Text>Fav</Text>
								<Tooltip
									multiline
									width={220}
									label="Unrelated to your favourite list from the offical app."
								>
									<IconInfoCircle size={20} />
								</Tooltip>
							</Flex>
						</th>
						<th>
							<Flex style={{ alignItems: "center" }}>
								<Text>Actions</Text>
								<Tooltip
									multiline
									width={220}
									label="You need to be logged in as a threads account to perform these actions."
								>
									<IconInfoCircle size={20} />
								</Tooltip>
							</Flex>
						</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
			<Flex px={"lg"} py={"xl"} style={{ justifyContent: "center" }}>
				<Pagination
					value={discover.query.offset / 5 + 1}
					onChange={setPage}
					total={discover.numPages}
				/>
			</Flex>
		</Box>
	);
}

export default ThreadsUserTable;
