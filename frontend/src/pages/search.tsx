import { useEffect, useState } from "react";
import {
	GetImagesForProfile,
	GetImagesFromThread,
} from "../../wailsjs/go/main/App";
import { Flex, Box, Tooltip, ScrollArea } from "@mantine/core";
import SearchGalleryMain from "../components/gallery/SearchGalleryMain";
import SearchGalleryControls from "../components/gallery/SearchGalleryControls";
import { useDispatch } from "react-redux";
import SearchBox from "../components/search/Searchbox";
import SearchLocalDatabase from "../components/search/SearchLocalDatabase";
import { IconBrandInstagram } from "@tabler/icons-react";
import AppScreenLayout from "../layouts/AppScreenLayout";
import ImageGalleryPreviewGrid from "../components/gallery/SearchGalleryPreview";

import PostInformation from "../components/postinfo/PostInformation";

function App() {
	const dispatch = useDispatch();
	const [SearchTerm, setSearchTerm] = useState("");

	const [SearchEnabled, setSearchEnabled] = useState(false);
	const [IsLoading, setIsLoading] = useState(false);
	const [SearchTermValid, setSearchTermValid] = useState<{
		validity: boolean;
		tooltip?: string;
	}>({
		validity: false,
		tooltip: undefined,
	});

	const regex = new RegExp("https://www.threads.net/@(.*?)/post/(.*?)/?$");
	const profileRegex = new RegExp("https://www.threads.net/(@.*?)/?$");

	function threadsLinkValidator(q: string) {
		const regex = new RegExp("https://www.threads.net/@(.*?)/post/(.*?)/?$");
		const profileRegex = new RegExp("https://www.threads.net/(@.*?)/?$");

		if (regex.test(q)) {
			return {
				valid: true,
				tooltip: "This is a valid thread",
			};
		} else if (profileRegex.test(q)) {
			return {
				valid: true,
				tooltip: "This is a valid profile",
			};
		} else {
			return {
				valid: false,
				tooltip: undefined,
			};
		}
	}

	async function onSearchboxClick(q: string) {
		setIsLoading(true);
		setSearchEnabled(false);
		dispatch({ type: "clearGallery" });

		// item is a thread
		if (regex.test(q)) {
			try {
				console.log("query", q);
				const res = await GetImagesFromThread(q);
				console.log("res", res);
				if (res.length > 0) {
					dispatch({ type: "setGallery", payload: res });
				}
			} catch (e) {
				console.log(e);
			}
		} else if (profileRegex.test(q)) {
			try {
				const res = await GetImagesForProfile(q);
				if (res.length > 0) {
					dispatch({ type: "setGallery", payload: res });
				}
			} catch (e) {
				console.log(e);
			}
		}
		setSearchEnabled(true);
		setIsLoading(false);
	}

	// show the user than their url is a valid one
	useEffect(() => {
		if (regex.test(SearchTerm)) {
			setSearchTermValid({
				validity: true,
				tooltip: "This is a valid thread",
			});
		} else if (profileRegex.test(SearchTerm)) {
			setSearchTermValid({
				validity: true,
				tooltip: "This is a valid profile",
			});
		} else {
			setSearchTermValid({
				validity: false,
				tooltip: undefined,
			});
		}
	}, [SearchTerm]);

	return (
		<AppScreenLayout>
			<Flex dir="row">
				<SearchBox
					validator={threadsLinkValidator}
					onClickCallback={onSearchboxClick}
					isLoadingOverride={IsLoading}
					placeholder="Paste URL here..."
				/>
				<Tooltip label="Auth toggle coming soon™">
					<Box mx={"xs"}>
						<IconBrandInstagram size={36} color="#666" />
					</Box>
				</Tooltip>
				<SearchLocalDatabase
					validator={threadsLinkValidator}
					onClickCallback={onSearchboxClick}
					isLoadingOverride={IsLoading}
					placeholder="Search local database..."
				/>
			</Flex>

			<Flex py={"md"} dir={"row"} h={"100%"}>
				<ImageGalleryPreviewGrid />

				<Box pos={"relative"} h={"100%"}>
					<ScrollArea h={"100%"} offsetScrollbars>
						<SearchGalleryMain />
						<PostInformation />
					</ScrollArea>
					<SearchGalleryControls />
				</Box>
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
