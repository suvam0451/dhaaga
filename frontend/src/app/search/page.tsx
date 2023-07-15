"use client";

import { useEffect, useRef, useState } from "react";
import "../App.css";
import {
	GetImagesForProfile,
	GetImagesFromThread,
} from "../../../wailsjs/go/main/App";
import { Image, Flex, Box, Grid } from "@mantine/core";
import Base64GalleryItem from "../../components/Base64GalleryItem";
import GalleryControllerArray from "../../components/gallery/GalleryControls";
import { useDispatch } from "react-redux";
import SearchBox from "../../components/search/Searchbox";
import SearchLocalDatabase from "../../components/search/SearchLocalDatabase";
import { IconBrandInstagram } from "@tabler/icons-react";
import AppScreenLayout from "../../layouts/AppScreenLayout";
import ImageGalleryPreviewGrid from "../../components/gallery/GalleryPreview";

function App() {
	const dispatch = useDispatch();
	const [SearchTerm, setSearchTerm] = useState("");
	const updateName = (e: any) => setSearchTerm(e.target.value);

	const [SearchEnabled, setSearchEnabled] = useState(false);
	const [SearchQuery, setSearchQuery] = useState<{
		query: string;
		type?: "profile" | "thread";
	}>({
		query: "",
		type: undefined,
	});
	const [IsLoading, setIsLoading] = useState(false);
	const [SearchTermValid, setSearchTermValid] = useState<{
		validity: boolean;
		tooltip?: string;
	}>({
		validity: false,
		tooltip: undefined,
	});
	const searchboxRef = useRef<HTMLInputElement>(null);

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
			// const query = q.match(regex)![1];

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
			// const query = q.match(profileRegex)![1];

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

	const FIXED_PREVIEW_WIDTH = 96;
	const FIXED_PREVIEW_HEIGHT = 128;

	return (
		<AppScreenLayout>
			<Flex dir="row">
				<SearchBox
					validator={threadsLinkValidator}
					onClickCallback={onSearchboxClick}
					isLoadingOverride={IsLoading}
					placeholder="Paste URL here..."
				/>
				<Box mx={"xs"}>
					<IconBrandInstagram size={36} color="#666" />
				</Box>
				<SearchLocalDatabase
					validator={threadsLinkValidator}
					onClickCallback={onSearchboxClick}
					isLoadingOverride={IsLoading}
					placeholder="Search local database..."
				/>
			</Flex>

			<Flex py={"md"} dir={"row"}>
				<ImageGalleryPreviewGrid />
				<Box pos={"relative"}>
					<Base64GalleryItem />
					<GalleryControllerArray />
				</Box>
			</Flex>
		</AppScreenLayout>
	);
}

export default App;
