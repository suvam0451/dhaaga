import { useEffect, useRef, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import {
	GetImagesForProfile,
	GetImagesFromThread,
} from "../wailsjs/go/main/App";
import {
	Button,
	Tabs,
	Input,
	Image,
	Flex,
	Container,
	Box,
	Grid,
	Loader,
	Text,
} from "@mantine/core";
import { IconCheck, IconSearch } from "@tabler/icons-react";
import Base64GalleryItem from "./components/Base64GalleryItem";
import GalleryControllerArray from "./components/gallery/GalleryControls";
import { useDispatch } from "react-redux";

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

	const regex = new RegExp("https://www.threads.net/t/(.*?)/?$");
	const profileRegex = new RegExp("https://www.threads.net/(@.*?)/?$");

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

	async function greet() {
		setIsLoading(true);
		setSearchEnabled(false);
		dispatch({ type: "clearGallery" });

		// item is a thread
		if (regex.test(SearchTerm)) {
			const query = SearchTerm.match(regex)![1];

			try {
				setSearchQuery({
					query,
					type: "thread",
				});
				const res = await GetImagesFromThread(query);
				if (res.length > 0) {
					dispatch({ type: "setGallery", payload: res });
				}
			} catch (e) {
				console.log(e);
			}
		} else if (profileRegex.test(SearchTerm)) {
			const query = SearchTerm.match(profileRegex)![1];

			try {
				setSearchQuery({
					query,
					type: "profile",
				});
				const res = await GetImagesForProfile(query);
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

	const FIXED_PREVIEW_WIDTH = "96px";
	const FIXED_PREVIEW_HEIGHT = "128px";

	return (
		<div id="App">
			<Container h={"100%"}>
				<Tabs variant="outline" defaultValue="search">
					<Tabs.List>
						<Tabs.Tab value="home">Home</Tabs.Tab>
						<Tabs.Tab value="search">Search</Tabs.Tab>
						<Tabs.Tab value="gallery">Gallery</Tabs.Tab>
						<Tabs.Tab value="settings">Settings</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="home" pt="xs">
						<img src={logo} id="logo" alt="logo" />
					</Tabs.Panel>

					<Tabs.Panel value="search" pt="xs">
						<Container size="xs" px="xs" h={"100%"}>
							<div id="input" className="input-box">
								<Flex>
									<Input
										icon={
											SearchTermValid.validity ? (
												<IconCheck color="green" />
											) : (
												<IconSearch />
											)
										}
										onChange={updateName}
										placeholder="Search for anything..."
										ref={searchboxRef}
										error={SearchTermValid.validity ? false : true}
									/>
									<Button onClick={greet}>
										{IsLoading ? (
											<Loader color="#fff" size={20} />
										) : (
											<Text>Go</Text>
										)}
									</Button>
								</Flex>
							</div>

							<Flex py={"xl"}>
								<Grid grow gutter="lg">
									<Grid.Col>
										<Box h={FIXED_PREVIEW_HEIGHT} w={FIXED_PREVIEW_WIDTH}>
											<Image
												maw={128}
												mx="auto"
												radius="md"
												src={""}
												alt="Random image"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col>
										<Box h={FIXED_PREVIEW_HEIGHT} w={FIXED_PREVIEW_WIDTH}>
											<Image
												maw={360}
												mx="auto"
												radius="md"
												src={""}
												alt="Random image"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col>
										<Box h={FIXED_PREVIEW_HEIGHT} w={FIXED_PREVIEW_WIDTH}>
											<Image
												maw={360}
												mx="auto"
												radius="md"
												src={""}
												alt="Random image"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col>
										<Box h={FIXED_PREVIEW_HEIGHT} w={FIXED_PREVIEW_WIDTH}>
											<Image
												maw={360}
												mx="auto"
												radius="md"
												src={""}
												alt="Random image"
											/>
										</Box>
									</Grid.Col>
								</Grid>

								<Box mih={"500px"} mah={"500px"} miw={"400px"} pos={"relative"}>
									<Base64GalleryItem />
									<GalleryControllerArray />
								</Box>
							</Flex>
						</Container>
					</Tabs.Panel>

					<Tabs.Panel value="gallery" pt="xs">
						Sample
					</Tabs.Panel>

					<Tabs.Panel value="settings" pt="xs">
						<img src={logo} id="logo" alt="logo" />
					</Tabs.Panel>
				</Tabs>
			</Container>
		</div>
	);
}

export default App;
