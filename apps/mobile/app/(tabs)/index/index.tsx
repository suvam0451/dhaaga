import { useEffect, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Account } from '@dhaaga/db';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppTheme,
	useHub,
} from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import SignedOutScreen from '#/features/onboarding/SignedOutScreen';
import { NativeTextH6, NativeTextMedium } from '#/ui/NativeText';
import SessionLoadingScreen from '#/features/onboarding/SessionLoadingScreen';
import HubTab from '#/features/hub/HubTab';
import useTimeOfDay from '#/ui/hooks/useTimeOfDay';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

type TimeOfDayGreetingProps = {
	acct: Account;
	noLogo?: boolean;
	style?: StyleProp<ViewStyle>;
};

type HubGreetingFragmentProps = {
	greeting: string;
	acct: Account;
	desc: string;
	driver: string;
	noLogo?: boolean;
};

function HubGreetingFragment({ greeting, acct }: HubGreetingFragmentProps) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				position: 'relative',
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<NativeTextH6
					numberOfLines={1}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				>
					{greeting}, {acct?.displayName}
				</NativeTextH6>
				<NativeTextMedium
					style={{
						color: theme.primary,
					}}
					numberOfLines={1}
				>
					@{acct?.username}@{acct?.server}
				</NativeTextMedium>
			</View>
		</View>
	);
}

export function TimeOfDayGreeting({ acct, style }: TimeOfDayGreetingProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const timeOfDay = useTimeOfDay();
	const Component = useMemo(() => {
		switch (timeOfDay) {
			case TIME_OF_DAY.MORNING:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={t(`hub.greetings.goodMorning`)}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.AFTERNOON:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={t(`hub.greetings.goodAfternoon`)}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.EVENING:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={t(`hub.greetings.goodEvening`)}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.NIGHT:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={t(`hub.greetings.goodNight`)}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
		}
	}, [acct, t, timeOfDay]);

	return (
		<View
			style={[
				{
					paddingHorizontal: 8,
				},
				style,
			]}
		>
			{Component}
		</View>
	);
}

function Screen() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();
	const { loadAccounts } = useHub();
	const { profiles, pageIndex } = useHub();

	useEffect(() => {
		loadAccounts();
	}, [acct]);

	if (!acct) {
		if (session.state === 'no-account' || session.state === 'invalid')
			return <SignedOutScreen />;
		else if (session.state === 'idle' || session.state === 'loading')
			return <SessionLoadingScreen />;
	}
	if (profiles?.length === 0) return <View />;
	return <HubTab profile={profiles[pageIndex]} />;
}

export default Screen;
