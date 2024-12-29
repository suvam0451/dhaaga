import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import SocialHub from '../../../components/screens/home/SocialHub';
import SoftwareHeader from '../../../screens/accounts/fragments/SoftwareHeader';
import { Account } from '../../../database/_schema';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

type TimeOfDayGreetingProps = {
	acct: Account;
};

type HubGreetingFragmentProps = {
	greeting: string;
	acct: Account;
	desc: string;
	driver: string;
};

function HubGreetingFragment({ greeting, acct }: HubGreetingFragmentProps) {
	const { theme } = useAppTheme();
	const fontStyle = {
		color: theme.textColor.medium,
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				position: 'relative',
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<Text numberOfLines={1} style={[fontStyle, { maxWidth: '80%' }]}>
					{greeting}, {acct.displayName}
				</Text>
				<Text
					style={{
						color: theme.primary.a0,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						maxWidth: '80%',
					}}
					numberOfLines={1}
				>
					@{acct.username}@{acct.server}
				</Text>
			</View>
			<View
				style={{
					position: 'absolute',
					right: 8,
					justifyContent: 'center',
					height: '100%',
					marginTop: 'auto',
				}}
			>
				<SoftwareHeader software={acct.driver} iconSizeMultiplier={2.5} />
			</View>
		</View>
	);
}

export function TimeOfDayGreeting({ acct }: TimeOfDayGreetingProps) {
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
					<HubGreetingFragment
						acct={acct}
						driver={acct.driver}
						greeting={`Good Morning`}
						desc={`@${acct.username}@${acct.server}`}
					/>
				);
			case TIME_OF_DAY.AFTERNOON:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct.driver}
						greeting={`Good Afternoon`}
						desc={`@${acct.username}@${acct.server}`}
					/>
				);
			case TIME_OF_DAY.EVENING:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct.driver}
						greeting={`Good Evening`}
						desc={`@${acct.username}@${acct.server}`}
					/>
				);
			case TIME_OF_DAY.NIGHT:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct.driver}
						greeting={`Good Night`}
						desc={`@${acct.username}@${acct.server}`}
					/>
				);
		}
	}, [acct]);

	return (
		<View
			style={{
				paddingHorizontal: 8,
			}}
		>
			{Component}
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
