import { Box, Image, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageBase64 } from "../lib/redux/slices/workerSlice"

/**
 * Populates the gallery image for the "Search" page
 * @param param0
 * @returns
 */
function Base64GalleryItem() {
	const dispatch = useDispatch();
	// @ts-ignore-next-line
	const galleryState = useSelector((o) => o.gallery);

	useEffect(() => {
		console.log(galleryState.galleryIndex);
		if (galleryState.galleryIndex === -1) return;

		// @ts-ignore-next-line
		dispatch(getImageBase64(galleryState.imageUrls[galleryState.galleryIndex]));
	}, [galleryState.galleryIndex]);

	const imageSrc = galleryState?.currentImage
		? `data:image/png;base64,${galleryState?.currentImage}`
		: undefined;

	return galleryState.currentImageLoading ? (
		<LoadingOverlay
			visible={galleryState.currentImageLoading}
			overlayBlur={2}
		/>
	) : galleryState.currentImage ? (
		<ScrollArea w={500} h={560}>
			<Box mah={500} maw={400}>
				<Image
					mx="auto"
					radius="md"
					src={imageSrc}
					alt={"Image"}
					pos={"relative"}
					fit={"contain"}
				/>
			</Box>
		</ScrollArea>
	) : (
		<Box>We have nothing to show you right now.</Box>
	);
}

export default Base64GalleryItem;
