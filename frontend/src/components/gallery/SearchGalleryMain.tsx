import {
	Box,
	Flex,
	Text,
	Image,
	LoadingOverlay,
	ScrollArea,
} from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageBase64 } from "../../lib/redux/slices/workerSlice";
import {
	GALLERY_FIXED_HEIGHT,
	GALLERY_FIXED_WIDTH,
	GALLERY_MAX_HEIGHT,
} from "../../constants/app-dimensions";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";
import { IconPlayerPlay } from "@tabler/icons-react";
import { GetAsset } from "../../../wailsjs/go/main/App";
import SearchGalleryVideo from "./SearchGalleryVideo";

function GalleryEmpty() {
	return (
		<Flex
			bg="#ddd"
			h={GALLERY_FIXED_HEIGHT}
			style={{
				borderRadius: "0.25em",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box>
				<Text>Looks like you have not searched for anything</Text>

				<Text>https://www.threads.net/@crunchyroll</Text>
			</Box>
		</Flex>
	);
}
/**
 * Populates the gallery image for the "Search" page
 * @param param0
 * @returns
 */
function Base64GalleryItem() {
	const dispatch = useDispatch<AppDispatch>();
	const galleryState = useSelector<RootState, GalleryState>((o) => o.gallery);

	useEffect(() => {
		if (galleryState.galleryIndex === -1) return;
		if (galleryState?.HasVideo && galleryState?.VideoLoaded) return;
		dispatch(
			getImageBase64(
				galleryState.imageUrls[galleryState.galleryIndex].asset_url
			)
		);
	}, [galleryState.galleryIndex, galleryState.VideoLoaded]);

	function onVideoLoadRequested() {
		if (
			!galleryState.HasVideo ||
			!galleryState?.currentItem?.video_download_url
		)
			return;

		dispatch({ type: "setGalleryVideoLoading", payload: true });
		GetAsset(galleryState?.currentItem?.video_download_url)
			.then((res) => {
				dispatch({
					type: "setGalleryVideoContent",
					payload: res,
				});
			})
			.finally(() => {
				dispatch({ type: "setGalleryVideoLoading", payload: false });
			});
	}

	const imageSrc = galleryState?.currentImage || null;

	return (
		<Box w={GALLERY_FIXED_WIDTH} mah={GALLERY_FIXED_HEIGHT}>
			{galleryState.currentImageLoading ? (
				<LoadingOverlay
					visible={galleryState.currentImageLoading}
					overlayBlur={2}
				/>
			) : galleryState.currentImage ? (
				<ScrollArea w={GALLERY_FIXED_WIDTH} mah={GALLERY_FIXED_HEIGHT}>
					<Box
						w={GALLERY_FIXED_WIDTH}
						mah={GALLERY_MAX_HEIGHT}
						pos={"relative"}
					>
						{galleryState?.HasVideo === true ? (
							galleryState?.VideoLoaded === true ? (
								<SearchGalleryVideo url={imageSrc as any} />
							) : (
								<Box>
									<Flex
										bg={"rgba(100, 100, 100, 0.75)"}
										h={"100%"}
										w={"100%"}
										pos={"absolute"}
										style={{
											zIndex: 99,
											alignItems: "center",
											justifyContent: "center",
										}}
										onClick={() => {
											if (galleryState?.VideoLoading) return;
											onVideoLoadRequested();
										}}
									>
										<Flex
											style={{
												border: "2px solid black",
												borderRadius: "100%",
											}}
											bg={"rbga(200, 200, 200, 1)"}
										>
											{galleryState?.VideoLoading ? (
												<LoadingOverlay
													visible={galleryState?.VideoLoading}
													overlayBlur={2}
												/>
											) : (
												<IconPlayerPlay
													style={{
														backgroundColor: "rbga(200, 200, 200, 1)",
													}}
													size={48}
												/>
											)}
										</Flex>
									</Flex>
									<Image
										mx="auto"
										radius="md"
										src={imageSrc}
										alt={"Image"}
										pos={"relative"}
										fit={"contain"}
									/>
								</Box>
							)
						) : (
							<Image
								mx="auto"
								radius="md"
								src={imageSrc}
								alt={"Image"}
								pos={"relative"}
								fit={"contain"}
							/>
						)}
					</Box>
				</ScrollArea>
			) : (
				<GalleryEmpty />
			)}
		</Box>
	);
}

export default Base64GalleryItem;
