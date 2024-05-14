import { Flex, Popover, Text } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

type ClickToCopyPops = {
	displayText?: string;
	copyText: string;
	size?: number;
	color?: string;
};

function ClickToCopy({ displayText, copyText, size, color }: ClickToCopyPops) {
	const [opened, setOpened] = useState(false);

	function copyRequested() {
		setOpened(true);
		navigator.clipboard.writeText(copyText);
		setTimeout(() => {
			setOpened(false);
		}, 750);
	}

	return (
		<Popover opened={opened}>
			<Popover.Target>
				<IconCopy
					color={color || "#888"}
					size={size || 20}
					onClick={copyRequested}
				/>
			</Popover.Target>
			<Popover.Dropdown>
				<Flex style={{alignItems: "center"}}>
					<IconCheck color="green" />
					<Text>{displayText || "Copied!"}</Text>
				</Flex>
			</Popover.Dropdown>
		</Popover>
	);
}

export default ClickToCopy;
