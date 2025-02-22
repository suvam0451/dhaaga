import {
	useAppApiClient,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import {
	useDiscoverState,
	useDiscoverDispatch,
	DiscoverStateAction,
} from '@dhaaga/core';
import { useEffect, useState } from 'react';
import DriverService, {
	SEARCH_RESULT_TAB,
} from '../../../services/driver.service';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { getSearchTabs } from '@dhaaga/db';

function WidgetExpanded() {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const dispatch = useDiscoverDispatch();
	const State = useDiscoverState();
	const CONTAINER_PADDING = 24;
	const [Tabs, setTabs] = useState<SEARCH_RESULT_TAB[]>([]);

	useEffect(() => {
		const searchTabs = getSearchTabs(driver);
		setTabs(searchTabs as any);

		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: searchTabs.find((o) => o === State.tab)
					? searchTabs.find((o) => o === State.tab)
					: searchTabs[0],
			},
		});
	}, [driver]);

	function setCategory(tab: SEARCH_RESULT_TAB) {
		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: tab as any,
			},
		});
	}

	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.palette.menubar,
					marginHorizontal: CONTAINER_PADDING,
				},
			]}
		>
			{Tabs.map((o, i) => (
				<Pressable
					key={i}
					onPress={() => {
						setCategory(o);
					}}
					style={{ flex: 1, paddingVertical: 10 }}
				>
					<AppText.Medium
						style={{
							color: State.tab === o ? theme.primary.a0 : theme.secondary.a20,
							fontSize: 18,
							textAlign: 'center',
						}}
					>
						{o}
					</AppText.Medium>
				</Pressable>
			))}
		</View>
	);
}

export default WidgetExpanded;

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4,
		borderRadius: 8,
	},
});
