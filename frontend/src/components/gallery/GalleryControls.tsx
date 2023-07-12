import { Box, Flex, Space } from "@mantine/core";
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
import { useDispatch } from "react-redux";

function GalleryControllerArray() {
	const dispatch = useDispatch();
	/**
	 * Handles key press actions
	 * @param e
	 */
	function keyPressHandler(e: any) {
		switch (e.keyCode) {
			case 37: {
				// console.log("Left Key pressed!");
				break;
			}
			case 38: {
				dispatch({
					type: "galleryPrev",
				});
				// console.log("up Key pressed!");
				break;
			}
			case 39: {
				// console.log("right key pressed");
				break;
			}
			case 40: {
				dispatch({
					type: "galleryNext",
				});
				break;
			}
		}
		// console.log(e);
	}

	useEffect(() => {
		document.addEventListener("keydown", keyPressHandler);
		return () => {
			document.removeEventListener("keydown", keyPressHandler);
		};
	}, []);

	const [SettingsHidden, setSettingsHidden] = useState(false);
	return (
		<Box
			pos={"absolute"}
			left={"100%"}
			top={"0%"}
			ml={"md"}
			// className="bg-red-400"
		>
			<Flex direction={"column"} className="flex flex-row bg-red-400">
				{/* Group 1 */}
				<IconHeart size={48} />
				<IconArrowsMaximize size={48} color="#ddd" />

				{/* Group 2 */}
				<Box className="flex-1">
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
