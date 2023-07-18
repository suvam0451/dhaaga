import { Box, Flex, RingProgress, Text, Tooltip } from "@mantine/core";
import {
	IconArrowsMaximize,
	IconChevronDown,
	IconChevronUp,
	IconDownload,
	IconEyeOff,
	IconHeart,
	IconSortDescending,
	IconSettings,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";
import { GALLERY_FIXED_HEIGHT } from "../../constants/app-dimensions";

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
			<Flex h={GALLERY_FIXED_HEIGHT} direction={"column"}>
				{/* Group 1 */}
				<IconHeart size={48} />

				<IconArrowsMaximize size={48} color="#ddd" />

				{/* Group 2 */}
				<Box my={"lg"} style={{ flexGrow: 1 }}>
					<Box h={"auto"} bg={"#eee"} style={{ borderRadius: "0.5em" }}>
						<Tooltip label="press ↑↓ or interact to navigate gallery">
							<RingProgress
								label={
									<Box
										style={{
											display: "flex",
											alignItems: "end",
											justifyContent: "center",
										}}
									>
										<Text span fw={"bold"} align="center">
											{galleryState.galleryIndex + 1}
										</Text>
										<Text span>/</Text>
										<Text size={12} span>
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
								size={56}
							/>
						</Tooltip>

						<Box
							sx={(theme) => ({
								"&:hover": {
									backgroundColor: theme.colors.gray[3],
								},
							})}
						>
							<IconChevronUp
								size={48}
								color="#aaa"
								onClick={() => {
									dispatch({ type: "galleryPrev" });
								}}
							/>
						</Box>
						<Box
							sx={(theme) => ({
								"&:hover": {
									backgroundColor: theme.colors.gray[3],
								},
							})}
						>
							<IconChevronDown
								size={48}
								color="#aaa"
								onClick={() => {
									dispatch({ type: "galleryNext" });
								}}
							/>
						</Box>
					</Box>
				</Box>

				<Box my={"lg"}></Box>
				{/* Group 3 */}
				<Box className="flex-1" style={{ flexGrow: 0 }}>
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
