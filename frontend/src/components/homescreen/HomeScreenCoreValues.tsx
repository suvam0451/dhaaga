import { Box, Card, Flex, Text } from "@mantine/core";
import { IconCode, IconDeviceDesktopBolt, IconLockHeart } from "@tabler/icons-react";

type CoreValueProps = {
	Icon: any;
	title: string;
	description: string;
};
function CoreValue({ Icon, title, description }: CoreValueProps) {
	return (
		<Card mx={"sm"} shadow="sm" padding="md" radius="md" withBorder style={{flex: 1}}>
			{Icon}
			<Text fw={"bold"}>{title}</Text>
			<Text size={14}>{description}</Text>
		</Card>
	);
}

function HomeScreenCoreValues() {
	return (
		<Flex mb={"md"} style={{justifyContent: "space-between"}}>
			<CoreValue
				Icon={<IconCode />}
				title={"Free and open source"}
				description={"The code for this project is freely available on Github"}
			/>
			<CoreValue
				Icon={<IconLockHeart />}
				title={"You own your data."}
				description={"This project does not collect any data from you"}
			/>
			<CoreValue
				Icon={<IconDeviceDesktopBolt />}
				title={"Use Across Platforms"}
				description={"Available on Windows, Mac and Linux"}
			/>
		</Flex>
	);
}

export default HomeScreenCoreValues;
