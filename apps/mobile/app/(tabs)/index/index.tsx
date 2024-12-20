import { Fragment, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { AppSegmentedControl } from '../../../components/lib/SegmentedControl';
import SocialHubPinnedTimelines from '../../../components/screens/home/stack/landing/fragments/SocialHubPinnedTimelines';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { SocialHubAvatarCircle } from '../../../components/lib/Avatar';
import { router } from 'expo-router';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import SocialHubPinnedProfiles from '../../../components/screens/home/stack/landing/fragments/SocialHubPinnedProfiles';
import SocialHubPinnedTags from '../../../components/screens/home/stack/landing/fragments/SocialHubPinnedTags';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

function TimeOfDayGreeting() {
	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

	const fontStyle = {
		color: theme.textColor.medium,
		marginTop: 16,
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	};

	const Component = useMemo(() => {
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

		switch (timeOfDay) {
			case TIME_OF_DAY.MORNING:
				return (
					<Fragment>
						<Text style={fontStyle}>Good Morning, {acct?.displayName}</Text>
					</Fragment>
				);
			case TIME_OF_DAY.AFTERNOON:
				return (
					<Fragment>
						<Text style={fontStyle}>Good Afternoon, {acct?.displayName}</Text>
					</Fragment>
				);
			case TIME_OF_DAY.EVENING:
				return (
					<Fragment>
						<Text style={fontStyle}>Good Evening, {acct?.displayName}</Text>
					</Fragment>
				);
			case TIME_OF_DAY.NIGHT:
				return (
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
				);
		}
	}, [acct?.displayName]);

	return (
		<View
			style={{
				paddingTop: 16,
				paddingHorizontal: 8,
			}}
		>
			{Component}
		</View>
	);
}

function Content() {
	const [Index, setIndex] = useState(0);
	return (
		<View>
			<View style={{ marginHorizontal: 10 }}>
				<AppSegmentedControl
					items={[
						{ label: 'Pinned' },
						{ label: 'Saved' },
						{ label: 'For You' },
					]}
					style={{ marginTop: 8 }}
					leftDecorator={
						<SocialHubAvatarCircle size={36} style={{ marginRight: 6 }} />
					}
					index={Index}
					setIndex={setIndex}
				/>
			</View>
			<SocialHubPinnedTimelines />
			<SocialHubPinnedProfiles style={{ marginTop: 16 }} />
			<SocialHubPinnedTags style={{ marginTop: 16 }} />
		</View>
	);
}

function Screen() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme, acct, loadActiveProfile } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			acct: o.acct,
			loadActiveProfile: o.loadActiveProfile,
		})),
	);

	function onRefresh() {
		setIsRefreshing(true);
		try {
			// possibly locked because of added/deleted account
			if (!acct) {
				loadActiveProfile();
				setIsRefreshing(false);
			}
		} catch (e) {
			setIsRefreshing(false);
		}
	}

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.HOME} />;

	return (
		<View style={{ position: 'relative' }}>
			<ScrollView
				style={{
					backgroundColor: theme.palette.bg,
					height: '100%',
				}}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
			>
				<View>
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
						{/*<TimeOfDayGreeting />*/}
						<Content />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

export default Screen;
