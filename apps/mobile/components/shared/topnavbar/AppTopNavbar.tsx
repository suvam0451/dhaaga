import { ReactNode } from 'react';
import { Animated, ScrollView, StyleProp, ViewStyle } from 'react-native';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import TopNavbarLandingGeneric from './fragments/TopNavbarLandingGeneric';
import TimelinesHeader from './fragments/TopNavbarTimelineStack';
import NotificationsHeader from './fragments/TopNavbarNotificationStack';
import TopNavbarProfilePage from './fragments/TopNavbarProfilePage';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

export enum APP_TOPBAR_TYPE_ENUM {
	GENERIC,
	TIMELINE,
	LANDING_GENERIC,
	NOTIFICATION_CENTER,
	PROFILE,
	APP_SETTINGS,
	MY_ACCOUNT,
	MY_PROFILE,
}

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY: Animated.AnimatedInterpolation<string | number>;
	type?: APP_TOPBAR_TYPE_ENUM;
	onRefresh?: () => void;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

function AppTopNavbar({
	title,
	children,
	translateY,
	type = APP_TOPBAR_TYPE_ENUM.GENERIC,
	contentContainerStyle,
}: AutoHideNavBarProps) {
	const { theme } = useAppTheme();

	let Header: ReactNode;

	switch (type) {
		case APP_TOPBAR_TYPE_ENUM.GENERIC:
			Header = <TopNavbarGeneric title={title} />;
			break;
		case APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC:
			Header = <TopNavbarLandingGeneric title={title} />;
			break;
		case APP_TOPBAR_TYPE_ENUM.TIMELINE:
			Header = <TimelinesHeader />;
			break;
		case APP_TOPBAR_TYPE_ENUM.NOTIFICATION_CENTER:
			Header = <NotificationsHeader />;
			break;
		case APP_TOPBAR_TYPE_ENUM.PROFILE:
			Header = <TopNavbarProfilePage title={title} />;
			break;
		default:
			Header = <TopNavbarGeneric title={title} />;
			break;
	}

	return (
		<Animated.View
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
			}}
		>
			<Animated.View
				style={[
					{
						position: 'absolute',
						zIndex: 1,
						transform: [
							{
								translateY,
							},
						],
					},
				]}
			>
				{Header}
			</Animated.View>
			<ScrollView
				contentContainerStyle={[
					{
						paddingHorizontal: 8,
						marginTop: 54,
					},
					contentContainerStyle,
				]}
			>
				{children}
			</ScrollView>
		</Animated.View>
	);
}

export default AppTopNavbar;
