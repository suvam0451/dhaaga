import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';
import { AppSegmentedControl } from '../../../components/lib/SegmentedControl';
import SocialHubQuickDestinations from '../../../components/screens/home/stack/landing/fragments/SocialHubQuickDestinations';
import { APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

function Header() {
	const { colorScheme } = useAppTheme();

	return (
		<View
			style={{
				paddingHorizontal: 12,
				paddingVertical: 16,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<View style={{ flexGrow: 1, flex: 1 }}>
					<Text
						style={[styles.headerText, { color: colorScheme.textColor.high }]}
					>
						Social Hub
					</Text>
				</View>
				<View style={{ padding: 4, transform: [{ translateX: -1 }] }}>
					<MaterialIcons
						name="notes"
						size={24}
						color={colorScheme.textColor.high}
						style={{ transform: [{ scaleX: -1 }] }}
					/>
				</View>
			</View>
		</View>
	);
}

function TimeOfDayGreeting() {
	const [TimeOfDay, setTimeOfDay] = useState<TIME_OF_DAY>(TIME_OF_DAY.UNKNOWN);
	const { colorScheme } = useAppTheme();
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

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

	const fontStyle = {
		color: colorScheme.textColor.high,
		marginTop: 8,
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	};
	return (
		<View
			style={{
				paddingTop: 16,
				paddingHorizontal: 8,
			}}
		>
			{TimeOfDay === TIME_OF_DAY.MORNING && (
				<Text style={fontStyle}>Good Morning</Text>
			)}
			{TimeOfDay === TIME_OF_DAY.AFTERNOON && (
				<Text style={fontStyle}>Good Afternoon</Text>
			)}
			{TimeOfDay === TIME_OF_DAY.EVENING && (
				<Text style={fontStyle}>Good Evening</Text>
			)}
			{TimeOfDay === TIME_OF_DAY.NIGHT && (
				<Text style={fontStyle}>Good Night, {acct?.displayName} 🌙</Text>
			)}
		</View>
	);
}

function Content() {
	return (
		<>
			<AppSegmentedControl
				items={[
					{ label: 'Profile' },
					{ label: 'Pinned by You' },
					{ label: 'Saved' },
				]}
				style={{ marginTop: 16 }}
			/>
			<SocialHubQuickDestinations />
		</>
	);
}

function Screen() {
	const { colorScheme } = useAppTheme();

	return (
		<View
			style={{
				height: '100%',
				position: 'relative',
				backgroundColor: colorScheme.palette.bg,
			}}
		>
			<ScrollView>
				<Header />
				<TimeOfDayGreeting />
				<Content />
			</ScrollView>
		</View>
	);
}

export default Screen;

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
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});
