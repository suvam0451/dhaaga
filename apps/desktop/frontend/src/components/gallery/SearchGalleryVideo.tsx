import { Box } from "@mantine/core";
import {
	GALLERY_FIXED_HEIGHT,
	GALLERY_FIXED_WIDTH,
} from "../../constants/app-dimensions";

type SearchGalleryVideoProps = {
	url: string;
};
function SearchGalleryVideo({ url }: SearchGalleryVideoProps) {
	return (
		<Box h={GALLERY_FIXED_HEIGHT} w={GALLERY_FIXED_WIDTH}>
			<video width={GALLERY_FIXED_WIDTH} height={GALLERY_FIXED_HEIGHT - 6} controls>
				<source type="video/webm" src={url} />
				<source type="video/mp4" src={url} />
			</video>
		</Box>
	);
}

export default SearchGalleryVideo;
