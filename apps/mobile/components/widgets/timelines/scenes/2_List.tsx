import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import TimelineLoading from '../../../loading-screens/TimelineLoading';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';
import useActivityPubLists, {
	AppAntennaDto,
	AppListDto,
} from '../../../../hooks/api/lists/useActivityPubLists';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { Fragment, memo } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type ListItemProps = {
	label: string;
	onPress: () => void;
};

const ListItem = memo(({ label, onPress }: ListItemProps) => {
	return (
		<TouchableOpacity style={styles.listItemContainer} onPress={onPress}>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
});

type ListProps = {
	items: AppListDto[];
};

const Lists = memo(({ items }: ListProps) => {
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();

	function onListSelected(idx: number) {
		const { id, label } = items[idx];
		setQuery({ id, label });
		setTimelineType(TimelineFetchMode.LIST);
		setShowTimelineSelection(false);
	}

	return (
		<Fragment>
			<View style={styles.sectionLabelContainer}>
				<View style={{ width: 32 }}>
					<Entypo name="list" size={24} color={APP_FONT.MONTSERRAT_BODY} />
				</View>
				<Text style={styles.sectionLabel}>Your lists:</Text>
			</View>
			{items.map((o, i) => (
				<ListItem
					key={i}
					label={o.label}
					onPress={() => {
						onListSelected(i);
					}}
				/>
			))}
		</Fragment>
	);
});

type AntennaListProps = {
	items: AppAntennaDto[];
};

const ANTENNA_COMPATIBLE_SOFTWARE = [
	KNOWN_SOFTWARE.FIREFISH,
	KNOWN_SOFTWARE.SHARKEY,
	KNOWN_SOFTWARE.MISSKEY,
];

const AntennaList = memo(({ items }: AntennaListProps) => {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();

	function onAntennaSelected(idx: number) {
		const { id, label } = items[idx];
		setQuery({ id, label });
		setTimelineType(TimelineFetchMode.ANTENNA);
		setShowTimelineSelection(false);
	}

	if (!ANTENNA_COMPATIBLE_SOFTWARE.includes(driver)) return <View />;

	return (
		<Fragment>
			<View style={styles.sectionLabelContainer}>
				<View style={{ width: 32 }}>
					<MaterialCommunityIcons
						name="antenna"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
				<Text style={styles.sectionLabel}>Your antennas:</Text>
			</View>

			{items.map((o, i) => (
				<ListItem
					key={i}
					label={o.label}
					onPress={() => {
						onAntennaSelected(i);
					}}
				/>
			))}
		</Fragment>
	);
});

const ListTimelineOptions = memo(() => {
	const { data: listsData, fetchStatus } = useActivityPubLists();

	if (fetchStatus === 'fetching') {
		return <TimelineLoading label={'Loading Your Lists'} />;
	}

	return (
		<View style={styles.rootContainer}>
			<Lists items={listsData.lists} />
			<AntennaList items={listsData.antennas} />
		</View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		padding: 8,
		paddingTop: 8,
	},
	sectionLabelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
		marginBottom: 4,
	},
	sectionLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		marginVertical: 8,
	},
	listItemContainer: {
		marginHorizontal: 0,
		backgroundColor: '#383838',
		padding: 10,
		borderRadius: 8,
		marginVertical: 4,
	},
});

export default ListTimelineOptions;
