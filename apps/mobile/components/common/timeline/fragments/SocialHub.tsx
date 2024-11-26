import {
	Button,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import { useEffect, useMemo, useState } from 'react';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTimelineController } from '../api/useTimelineController';
import { UserDataTimeline } from '../../../../entities/userdata-timeline.entity';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { TimelineFetchMode } from '../utils/timeline.types';
import { APP_FONTS } from '../../../../styles/AppFonts';
import SocialHubLantern from '../../../screens/home/stack/landing/fragments/SocialHubLantern';
import SocialHubAssistant from '../../../screens/home/stack/landing/fragments/SocialHubAssistant';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import SocialHubQuickDestinations from '../../../screens/home/stack/landing/fragments/SocialHubQuickDestinations';
import { DbMetaRepo } from '../../../../database/repositories/_meta.repo';
enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

type PinnedItemProps = {
	timelineType: TimelineFetchMode;
};

function PinnedItem({ timelineType }: PinnedItemProps) {
	const Icon = useMemo(() => {
		switch (timelineType) {
			case TimelineFetchMode.IDLE:
				return <View></View>;
			case TimelineFetchMode.HOME:
				return (
					<FontAwesome5
						name="home"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.LOCAL:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.FEDERATED:
				return (
					<FontAwesome6
						name="globe"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.HASHTAG:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.REMOTE_TIMELINE:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.LIST:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			case TimelineFetchMode.USER:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				);
			default:
				return <View></View>;
		}
	}, [timelineType]);

	const Label = useMemo(() => {
		switch (timelineType) {
			case TimelineFetchMode.IDLE:
				return 'Home Screen';
			case TimelineFetchMode.HOME:
				return 'Home';
			case TimelineFetchMode.LOCAL:
				return 'Local';
			case TimelineFetchMode.FEDERATED:
				return 'Federated';
			case TimelineFetchMode.HASHTAG:
				return 'Hashtag';
			case TimelineFetchMode.REMOTE_TIMELINE:
				return 'Remote Timeline';
			case TimelineFetchMode.LIST:
				return 'List';
			case TimelineFetchMode.USER:
				return 'User';
			default:
				return 'N/A';
		}
	}, [timelineType]);

	return (
		<View style={styles.quickActionButtonContainer}>
			<View style={{ width: 16 }}>{Icon}</View>
			<View style={{ marginLeft: 8, flex: 1 }}>
				<Text style={{ flex: 1 }}>{Label}</Text>
			</View>
		</View>
	);
}

type UserDataPinnedItemProps = {
	dto: UserDataTimeline;
};

function TimelineItem({ dto }: UserDataPinnedItemProps) {
	const { type } = dto;
	const { setTimelineType } = useTimelineController();
	const Icon = useMemo(() => {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return <View></View>;
			case TimelineFetchMode.HOME:
				return (
					<FontAwesome5 name="home" size={20} color={APP_FONT.HIGH_EMPHASIS} />
				);
			case TimelineFetchMode.LOCAL:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.HIGH_EMPHASIS}
					/>
				);
			case TimelineFetchMode.FEDERATED:
				return (
					<FontAwesome6 name="globe" size={20} color={APP_FONT.HIGH_EMPHASIS} />
				);
			case TimelineFetchMode.HASHTAG:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.HIGH_EMPHASIS}
					/>
				);
			case TimelineFetchMode.REMOTE_TIMELINE:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.HIGH_EMPHASIS}
					/>
				);
			case TimelineFetchMode.LIST:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.HIGH_EMPHASIS}
					/>
				);
			case TimelineFetchMode.USER:
				return (
					<FontAwesome5
						name="user-friends"
						size={20}
						color={APP_FONT.HIGH_EMPHASIS}
					/>
				);
			default:
				return <View></View>;
		}
	}, [type]);

	const Label = useMemo(() => {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return 'Home Screen';
			case TimelineFetchMode.HOME:
				return 'Home';
			case TimelineFetchMode.LOCAL:
				return 'Local';
			case TimelineFetchMode.FEDERATED:
				return 'Federated';
			case TimelineFetchMode.HASHTAG:
				return 'Hashtag';
			case TimelineFetchMode.REMOTE_TIMELINE:
				return 'Remote Timeline';
			case TimelineFetchMode.LIST:
				return 'List';
			case TimelineFetchMode.USER:
				return 'User';
			default:
				return 'N/A';
		}
	}, [type]);

	function onPress() {
		switch (type) {
			case TimelineFetchMode.LOCAL: {
				setTimelineType(type);
				break;
			}
			case TimelineFetchMode.HOME: {
				setTimelineType(type);
				break;
			}
		}
	}

	return (
		<Pressable style={styles.quickActionButtonContainer} onPress={onPress}>
			<View>{Icon}</View>
			<View style={{ marginLeft: 8 }}>
				<Text
					style={{
						color: APP_FONT.HIGH_EMPHASIS,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					{Label}
				</Text>
			</View>
		</Pressable>
	);
}

function SocialHub() {
	const [TimeOfDay, setTimeOfDay] = useState<TIME_OF_DAY>(TIME_OF_DAY.UNKNOWN);
	const userDataTimelines = []; // useQuery(UserDataTimeline).filter((o) => o.pinned);
	const { colorScheme } = useAppTheme();

	useEffect(() => {
		const currentHours = new Date().getHours();
		let timeOfDay: TIME_OF_DAY;
		if (currentHours >= 21 || (currentHours >= 0 && currentHours < 6)) {
			timeOfDay = TIME_OF_DAY.NIGHT;
		} else if (currentHours >= 6 && currentHours < 12) {
			timeOfDay = TIME_OF_DAY.MORNING;
		} else if (currentHours >= 12 && currentHours < 17) {
			timeOfDay = TIME_OF_DAY.AFTERNOON;
		} else {
			timeOfDay = TIME_OF_DAY.EVENING;
		}
		setTimeOfDay(timeOfDay);
	}, []);

	const PinnedItems = useMemo(() => {
		const retval = [];
		for (let i = 0; i < userDataTimelines.length; i = i + 2) {
			if (i + 2 < userDataTimelines.length) {
				retval.push(
					<View style={styles.quickActionButtonGroupContainer}>
						<TimelineItem dto={userDataTimelines[i]} />
						<TimelineItem dto={userDataTimelines[i + 1]} />
					</View>,
				);
			} else {
				retval.push(
					<View style={styles.quickActionButtonGroupContainer}>
						<TimelineItem dto={userDataTimelines[i]} />
						<View style={{ flex: 1, marginHorizontal: 16 }}></View>
					</View>,
				);
			}
		}
		return (
			<View>
				{retval.map((o, i) => (
					<View key={i}>{o}</View>
				))}
			</View>
		);
	}, [userDataTimelines]);

	function onDemoFunctionPress() {
		DbMetaRepo.listTables();
	}
	return (
		<View
			style={{
				height: '100%',
				position: 'relative',
				backgroundColor: colorScheme.palette.bg,
			}}
		>
			{/*<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />*/}
			<TimelinesHeader title={'Social Hub'} />

			<ScrollView>
				<View
					style={{
						height: '100%',
						paddingTop: 16,
						backgroundColor: colorScheme.palette.bg,
						position: 'relative',
						paddingHorizontal: 8,
					}}
				>
					<Button title={'Sample Press'} onPress={onDemoFunctionPress} />
					<SocialHubLantern />
					{TimeOfDay === TIME_OF_DAY.MORNING && (
						<Text
							style={[
								styles.timeOfDayText,
								{ color: colorScheme.textColor.medium },
							]}
						>
							Good Morning
						</Text>
					)}
					{TimeOfDay === TIME_OF_DAY.AFTERNOON && (
						<Text
							style={[
								styles.timeOfDayText,
								{ color: colorScheme.textColor.medium },
							]}
						>
							Good Afternoon
						</Text>
					)}
					{TimeOfDay === TIME_OF_DAY.EVENING && (
						<Text
							style={[
								styles.timeOfDayText,
								{ color: colorScheme.textColor.medium },
							]}
						>
							Good Evening
						</Text>
					)}
					{TimeOfDay === TIME_OF_DAY.NIGHT && (
						<Text
							style={[
								styles.timeOfDayText,
								{ color: colorScheme.textColor.medium },
							]}
						>
							Good Night 🌙
						</Text>
					)}

					<SocialHubQuickDestinations />

					<View>
						<View
							style={{
								marginTop: 64,
								backgroundColor: colorScheme.palette.menubar,
								padding: 8,
								borderRadius: 8,
							}}
						>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<View style={{ width: 28 }}>
									<AntDesign
										name="pushpin"
										size={24}
										color={APP_THEME.COLOR_SCHEME_B}
										style={{ marginRight: 4 }}
									/>
								</View>
								<Text
									style={{
										fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
										fontSize: 20,
										marginLeft: 4,
										flexGrow: 1,
										color: APP_FONT.MONTSERRAT_BODY,
									}}
								>
									Pinned
								</Text>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<View style={{ marginRight: 8 }}>
										<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
											Show All
										</Text>
									</View>
									<View
										style={{
											paddingHorizontal: 8,
											paddingVertical: 4,
										}}
										onTouchEnd={() => {
											router.push('/pinned');
										}}
									>
										<FontAwesome6
											name="chevron-right"
											size={20}
											color={APP_FONT.MONTSERRAT_BODY}
										/>
									</View>
								</View>
							</View>
						</View>

						{PinnedItems}
					</View>
				</View>
			</ScrollView>
			<SocialHubAssistant />
		</View>
	);
}

const styles = StyleSheet.create({
	quickActionButtonGroupContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 16,
	},
	quickActionButtonContainer: {
		display: 'flex',
		flexDirection: 'row',
		flex: 1,
		marginHorizontal: 8,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: APP_THEME.MENTION_LIGHT,
		padding: 8,
		borderRadius: 4,
	},
	featureNotAvailableNoteContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		marginTop: 16,
		borderRadius: 8,
		borderWidth: 1,
		opacity: 0.6,
		borderColor: APP_THEME.COLOR_SCHEME_C,
	},
	timeOfDayText: {
		fontSize: 32,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		marginLeft: 8,
	},
});

export default SocialHub;
