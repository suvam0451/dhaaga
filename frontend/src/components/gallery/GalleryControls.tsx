import { Box, Flex, RingProgress, Text } from "@mantine/core";
import {
	IconArrowsMaximize,
	IconChevronDown,
	IconChevronUp,
	IconDownload,
	IconEyeOff,
	IconHeart,
	IconSortDescending,
	IconSettings,
	IconDeselect,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";

function GalleryControllerArray() {
	const dispatch = useDispatch();
	const galleryState = useSelector<RootState, GalleryState>((o) => o.gallery);

	/**
	 * Handles key press actions
	 * @param e
	 */
	function keyPressHandler(e: any) {
		switch (e.keyCode) {
			case 37: {
				break;
			}
			case 38: {
				dispatch({
					type: "galleryPrev",
				});
				break;
			}
			case 39: {
				break;
			}
			case 40: {
				dispatch({
					type: "galleryNext",
				});
				break;
			}
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", keyPressHandler);
		return () => {
			document.removeEventListener("keydown", keyPressHandler);
		};
	}, []);

	const [SettingsHidden, setSettingsHidden] = useState(false);
	return (
		<Box pos={"absolute"} left={"100%"} top={"0%"} ml={"md"}>
			<Flex direction={"column"} className="flex flex-row bg-red-400">
				{/* Group 1 */}
				<IconHeart size={48} />

				<IconArrowsMaximize size={48} color="#ddd" />

				<Box my={"lg"}></Box>

				{/* Group 2 */}
				<Box bg={"#eee"} className={"flex-1 rounded-lg"}>
					<RingProgress
						label={
							<Box>
								<Text span fw={"bold"} align="center">
									{galleryState.galleryIndex + 1}
								</Text>
								<Text span>/</Text>
								<Text size={"xs"} span>
									{galleryState.imageUrls.length}
								</Text>
							</Box>
						}
						thickness={3}
						sections={[
							{
								value:
									galleryState.imageUrls.length === 0
										? 0
										: ((galleryState.galleryIndex + 1) /
												galleryState.imageUrls.length) *
										  100,
								color: "gray",
							},
						]}
						size={64}
					/>

					<IconChevronUp
						size={48}
						color="#aaa"
						onClick={() => {
							dispatch({ type: "galleryPrev" });
						}}
					/>
					<IconChevronDown
						size={48}
						color="#aaa"
						onClick={() => {
							dispatch({ type: "galleryNext" });
						}}
					/>
				</Box>

				<Box my={"lg"}></Box>
				{/* Group 3 */}
				<Box className="flex-1">
					{SettingsHidden && (
						<Box>
							<IconEyeOff size={48} color="#ddd" />
							<IconSortDescending size={48} color="#ddd" />
							<IconDownload size={48} />
						</Box>
					)}

					<IconSettings
						size={48}
						onClick={() => setSettingsHidden(!SettingsHidden)}
					/>
				</Box>
			</Flex>
		</Box>
	);
}

export default GalleryControllerArray;
