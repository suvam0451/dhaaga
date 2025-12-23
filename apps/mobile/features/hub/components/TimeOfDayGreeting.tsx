import { useAppTheme } from '#/states/global/hooks';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Account } from '@dhaaga/db';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useTimeOfDay from '#/ui/hooks/useTimeOfDay';
import { NativeTextH6, NativeTextMedium } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

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

type Props = {
	acct: Account;
	noLogo?: boolean;
	style?: StyleProp<ViewStyle>;
};

function TimeOfDayGreeting({ acct, style }: Props) {
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
export default TimeOfDayGreeting;
