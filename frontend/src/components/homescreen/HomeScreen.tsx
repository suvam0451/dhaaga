import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { IconAccessible, IconAccessibleOff } from "@tabler/icons-react";

type FeatureShowcaseProps = {
  title: string;
  description: string;
  icon: any;
}

function FeatureShowcase({}: FeatureShowcaseProps) {

}
function HomeScreenComponent() {
	return <Card shadow="sm" padding="lg" radius="md" withBorder>

		<Group position="apart" mt="md" mb="xs">
      <IconAccessible/>
			<Text weight={500}>Accessibility</Text>
			<Badge color="pink" variant="light">
				On Sale
			</Badge>
		</Group>

		<Text size="sm" color="dimmed">
			This application is designed to be keyboard and split-screen friendly.
		</Text>

		<Button variant="light" color="blue" fullWidth mt="md" radius="md">
			Go there now
		</Button>
	</Card>;
}

export default HomeScreenComponent;
