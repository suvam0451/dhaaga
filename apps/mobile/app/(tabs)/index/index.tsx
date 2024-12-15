import { Fragment, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';
import { AppSegmentedControl } from '../../../components/lib/SegmentedControl';
import SocialHubQuickDestinations from '../../../components/screens/home/stack/landing/fragments/SocialHubQuickDestinations';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { SocialHubAvatarCircle } from '../../../components/lib/Avatar';
import { router } from 'expo-router';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
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
		color: colorScheme.textColor.medium,
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
				<Fragment>
					<Text style={fontStyle}>Good Night, {acct?.displayName}</Text>
					<Text
						style={{
							fontSize: 72,
							position: 'absolute',
							textAlign: 'right',
							zIndex: -1,
							opacity: 0.28,
							width: '100%',
							top: -32,
						}}
					>
						🌙
					</Text>
				</Fragment>
			)}
		</View>
	);
}

function Content() {
	return (
		<View style={{ flexGrow: 1, flex: 1 }}>
			<View style={{ marginHorizontal: 10 }}>
				<AppSegmentedControl
					items={[
						{ label: 'Pinned' },
						{ label: 'Saved' },
						{ label: 'For You' },
					]}
					style={{ marginTop: 16 }}
					leftDecorator={
						<SocialHubAvatarCircle size={36} style={{ marginRight: 6 }} />
					}
				/>
			</View>
			<SocialHubQuickDestinations />
		</View>
	);
}

function Tip() {
	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

	const fontStyle = {
		color: theme.textColor.low,
		marginTop: 32,
		marginHorizontal: 10,
		fontSize: 12,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	};

	return (
		<Text style={fontStyle}>
			[TIP] Long press the home button to return here anytime.
		</Text>
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
				<View style={{ minHeight: '100%' }}>
					<View style={{ flexGrow: 1 }}>
						<AppTabLandingNavbar
							type={APP_LANDING_PAGE_TYPE.HOME}
							menuItems={[
								{
									iconId: 'user-guide',
									onPress: () => {
										router.push('/user-guide');
									},
								},
							]}
						/>
						<TimeOfDayGreeting />
						<Content />
					</View>

					<View style={{ marginBottom: 24 }}>
						<Tip />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

export default Screen;
