import { useState } from "react";
import { Box, Tabs } from "@mantine/core";
import MastodonTimelinesProvider from "../../contexts/MastodonTimeline";
import AdvancedScrollAreaProvider from "../../contexts/AdvancedScrollArea";
import { ColumnGeneratorProps } from "./columns.types";
import DiscoverModuleBreadcrumbs from "../navigation/NavigationBreadcrumbs";
import TimelineRenderer from "./TimelineRenderer";
import AdvancedScrollArea from "../navigation/AdvancedScrollArea";
import { COLUMN_MIN_WIDTH } from "../../constants/app-dimensions";

function MastadonTimelineColumn({ index, query }: ColumnGeneratorProps) {
	const [activeTab, setActiveTab] = useState<string | null>("home");

	return (
		<Box h={"100%"} w={COLUMN_MIN_WIDTH+12}>
			<DiscoverModuleBreadcrumbs index={index} />
			<AdvancedScrollAreaProvider>
				<AdvancedScrollArea>
					<Tabs value={activeTab} onTabChange={setActiveTab} h={"100%"}>
						<Tabs.List>
							<Tabs.Tab value="home">Home</Tabs.Tab>
							<Tabs.Tab value="local">Local</Tabs.Tab>
							<Tabs.Tab value="federated">Federated</Tabs.Tab>
							<Tabs.Tab value="tapper">Tapper</Tabs.Tab>
							<Tabs.Tab value="list">List</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="home" h={"100%"}>
							<MastodonTimelinesProvider>
								<TimelineRenderer />
							</MastodonTimelinesProvider>
						</Tabs.Panel>
					</Tabs>
				</AdvancedScrollArea>
			</AdvancedScrollAreaProvider>
		</Box>
	);
}

export default MastadonTimelineColumn;
