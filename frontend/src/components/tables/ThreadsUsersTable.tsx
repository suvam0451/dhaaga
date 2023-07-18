import {
	Box,
	Button,
	Flex,
	Pagination,
	Popover,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import {
	IconCheck,
	IconCopy,
	IconHeart,
	IconInfoCircle,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { DiscoverSearchState } from "../../lib/redux/slices/discoverSearchSlice";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getDashboardSearchResults } from "../../lib/redux/slices/workerSlice";
import { ThreadsUser } from "./tables.types";
import { AvatarBase64Loader } from "../variants/search-recommendations/threadsDesktop";
import { GALLERY_FIXED_WIDTH } from "../../constants/app-dimensions";
import UserFavouriteController from "./utils/FavouriteUser";

function CopyUsername({ text }: { text: string }) {
	const [opened, setOpened] = useState(false);
	const [CopyText, setCopyText] = useState<string>(text);

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

	const [SearchTerm, setSearchTerm] = useState<string>("");
	const [debounced] = useDebouncedValue(SearchTerm || "", 200);

	function onSearchClick() {}

	// Reset the offset (pagination) when the search term changes
	useEffect(() => {
		dispatch({
			type: "setDashboardOffset",
			payload: 0,
		})
	}, [debounced])

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
		</tr>
	));

	function setPage(ans: number) {
		console.log(ans)
		dispatch({
			type: "setDashboardOffset",
			payload: (ans-1) * 5,
		})
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
		<Box miw={GALLERY_FIXED_WIDTH}>
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
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
			<Flex px={"lg"} py={"xl"} style={{ justifyContent: "center" }}>
				<Pagination value={discover.query.offset/5 + 1} onChange={setPage} total={discover.numPages} />
			</Flex>
		</Box>
	);
}

export default ThreadsUserTable;
