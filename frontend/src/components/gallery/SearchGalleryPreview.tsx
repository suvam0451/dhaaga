import { useEffect, useState } from "react";
import { GetAsset } from "../../../wailsjs/go/main/App";
import { Box, Grid, Image, ScrollArea } from "@mantine/core";
import { GALLERY_PREVIEW_ITEM_FIXED_PREVIEW_WIDTH } from "../../constants/app-dimensions";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";

type GalleryPreviewItemProps = {
	url: string | null;
};

function GalleryPreviewItem({ url }: GalleryPreviewItemProps) {
	const [Base64ImageData, setBase64ImageData] = useState<string | null>(null);
	useEffect(() => {
		if (!url) return;
		const re = /placehold\.co/;
		if (re.test(url)) {
			setBase64ImageData(url);
			return;
		}
		GetAsset(url)
			.then((o) => {
				if (o === undefined) {
					setBase64ImageData(null);
				} else {
					setBase64ImageData(o);
				}
			})
			.catch((e) => {
				setBase64ImageData(null);
			});
	}, [url]);

	return (
		<Image
			mx="auto"
			radius="md"
			src={Base64ImageData as any}
			alt={"Image"}
			pos={"relative"}
			fit={"fill"}
			style={
				{
					// boxShadow: "2px 2px 8px #888"
				}
			}
		/>
	);
}

type GalleryPreviewItem_ControllerProps = {
	offset: number;
};

function GalleryPreviewItem_Controller({
	offset,
}: GalleryPreviewItem_ControllerProps) {
	const galleryState = useSelector<RootState, GalleryState>((o) => o.gallery);
	const [ImageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		if (galleryState.galleryIndex === -1) {
			setImageUrl("https://placehold.co/360x480/png");
			return;
		}

		if (galleryState.galleryIndex + offset == -1) {
			setImageUrl("https://placehold.co/360x480/png?text=Start+of\\nGallery");
			return;
		}
		if (galleryState.galleryIndex + offset == galleryState.imageUrls.length) {
			setImageUrl("https://placehold.co/360x480/png?text=End+of\\nGallery");
			return;
		}

		if (
			offset > 1 &&
			galleryState.galleryIndex + offset > galleryState.imageUrls.length - 1
		) {
			setImageUrl("https://placehold.co/360x480/png?text=");
			return;
		}

		if (offset < -1 && galleryState.galleryIndex + offset < 0) {
			setImageUrl("https://placehold.co/360x480/png?text=");
			return;
		}
		if (
			galleryState.galleryIndex + offset < 0 ||
			galleryState.galleryIndex + offset > galleryState.imageUrls.length - 1
		) {
			setImageUrl("https://placehold.co/360x480/png");
			return;
		}
		setImageUrl(
			galleryState.imageUrls[galleryState.galleryIndex + offset].asset_url
		);
	}, [offset, galleryState.galleryIndex, galleryState.imageUrls]);

	return (
		<GalleryPreviewItem url={ImageUrl || "https://placehold.co/360x480/png"} />
	);
}

function ImageGalleryPreviewGrid() {
	return (
		<ScrollArea mah={800} offsetScrollbars maw={108} mr={"md"}>
			<Grid gutter="sm" >
				<Grid.Col h={"auto"}>
					<Box w={GALLERY_PREVIEW_ITEM_FIXED_PREVIEW_WIDTH}>
						<GalleryPreviewItem_Controller offset={-1} />
					</Box>
				</Grid.Col>
				<Grid.Col>
					<Box w={GALLERY_PREVIEW_ITEM_FIXED_PREVIEW_WIDTH}>
						<GalleryPreviewItem_Controller offset={0} />
					</Box>
				</Grid.Col>
				<Grid.Col>
					<Box w={GALLERY_PREVIEW_ITEM_FIXED_PREVIEW_WIDTH}>
						<GalleryPreviewItem_Controller offset={1} />
					</Box>
				</Grid.Col>
				<Grid.Col>
					<Box w={GALLERY_PREVIEW_ITEM_FIXED_PREVIEW_WIDTH}>
						<GalleryPreviewItem_Controller offset={2} />
					</Box>
				</Grid.Col>
			</Grid>
		</ScrollArea>
	);
}

export default ImageGalleryPreviewGrid;
