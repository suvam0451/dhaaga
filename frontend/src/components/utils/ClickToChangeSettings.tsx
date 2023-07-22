import { Button, Flex, Popover, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

type ClickToChangeSettingsProps = {
	onClick: () => Promise<boolean>;
	buttonLabel: string;
	successContent: string;
	failureContent: string;
};

function ClickToChangeSettings({
	buttonLabel,
	onClick,
	successContent,
	failureContent,
}: ClickToChangeSettingsProps) {
	const [opened, setOpened] = useState(false);
	const [PopupContent, setPopupContent] = useState<string>("");

	function taskCompletedCallback() {
		setOpened(true);
		setTimeout(() => {
			setOpened(false);
		}, 750);
	}

	async function onClickCallback() {
		try {
			const result = await onClick();
			if (result) {
				setPopupContent(successContent);
			} else {
				setPopupContent(failureContent);
			}
		} catch (e) {
			setPopupContent(failureContent);
		} finally {
			taskCompletedCallback();
		}
	}

	return (
		<Popover opened={opened}>
			<Popover.Target>
				<Button mx={"sm"} onClick={onClickCallback}>
					{buttonLabel}
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<Flex style={{ alignItems: "center" }}>
					<IconCheck color="green" />
					<Text>{PopupContent || "Copied!"}</Text>
				</Flex>
			</Popover.Dropdown>
		</Popover>
	);
}

export default ClickToChangeSettings;
