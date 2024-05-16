import { Box, Flex, Popover, Text } from "@mantine/core";
import { IconCheck, IconClipboardCheck } from "@tabler/icons-react";
import { useState } from "react";

type ClickToCopyPops = {
	displayText?: string;
	size?: number;
	color?: string;
	callback: (x: string) => void;
};

function ClickToPaste({ callback, displayText, size, color }: ClickToCopyPops) {
	const [opened, setOpened] = useState(false);

	function pasteRequested() {
		setOpened(true);
		navigator.clipboard
			.readText()
			.then((text) => {
				callback(text);
			})
			.catch((err) => {
				console.error("Failed to read clipboard contents: ", err);
			});

		setTimeout(() => {
			setOpened(false);
		}, 750);
	}

	return (
		<Flex mx={"xs"} style={{ alignItems: "center" }}>
			<Popover opened={opened}>
				<Popover.Target>
					<IconClipboardCheck
						color={color || "#888"}
						size={size || 20}
						onClick={pasteRequested}
					/>
				</Popover.Target>
				<Popover.Dropdown>
					<Flex style={{ alignItems: "center" }}>
						<IconCheck color="green" />
						<Text>{displayText || "Copied!"}</Text>
					</Flex>
				</Popover.Dropdown>
			</Popover>
		</Flex>
	);
}

export default ClickToPaste;
