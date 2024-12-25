import { Fragment, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { AppSegmentedControl } from '../../../components/lib/SegmentedControl';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { SocialHubAvatarCircle } from '../../../components/lib/Avatar';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import SocialHub from '../../../components/screens/home/SocialHub';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

/**
 * @deprecated
 * @constructor
 */
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
			{/*<SocialHubPinnedTimelines  />*/}
			{/*<SocialHubPinnedProfiles style={{ marginTop: 16 }} />*/}
			{/*<SocialHubPinnedTags style={{ marginTop: 16 }} />*/}
		</View>
	);
}

function Screen() {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.HOME} />;
	return <SocialHub />;
}

export default Screen;
