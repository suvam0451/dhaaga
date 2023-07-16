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
		dispatch(
			getImageBase64(
				galleryState.imageUrls[galleryState.galleryIndex].asset_url
			)
		);
	}, [galleryState.galleryIndex]);

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
					<Box w={GALLERY_FIXED_WIDTH} mah={GALLERY_MAX_HEIGHT}>
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
				<GalleryEmpty />
			)}
		</Box>
	);
}

export default Base64GalleryItem;
