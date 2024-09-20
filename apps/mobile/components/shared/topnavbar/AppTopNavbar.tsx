import { Fragment, memo, useMemo } from 'react';
import { Animated, StatusBar, StyleSheet } from 'react-native';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import TopNavbarLandingGeneric from './fragments/TopNavbarLandingGeneric';
import TimelinesHeader from './fragments/TopNavbarTimelineStack';
import NotificationsHeader from './fragments/TopNavbarNotificationStack';
import TopNavbarProfilePage from './fragments/TopNavbarProfilePage';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';
import { APP_THEME } from '../../../styles/AppTheme';

export enum APP_TOPBAR_TYPE_ENUM {
	GENERIC,
	TIMELINE,
	LANDING_GENERIC,
	NOTIFICATION_CENTER,
	PROFILE,
}

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY: Animated.AnimatedInterpolation<string | number>;
	type?: APP_TOPBAR_TYPE_ENUM;
};

const AppTopNavbar = memo(
	({
		title,
		children,
		translateY,
		type = APP_TOPBAR_TYPE_ENUM.GENERIC,
	}: AutoHideNavBarProps) => {
		const { colorScheme } = useAppTheme();
		const Header = useMemo(() => {
			switch (type) {
				case APP_TOPBAR_TYPE_ENUM.GENERIC:
					return <TopNavbarGeneric title={title} />;
				case APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC:
					return <TopNavbarLandingGeneric title={title} />;
				case APP_TOPBAR_TYPE_ENUM.TIMELINE:
					return <TimelinesHeader title={title} />;
				case APP_TOPBAR_TYPE_ENUM.NOTIFICATION_CENTER:
					return <NotificationsHeader />;
				case APP_TOPBAR_TYPE_ENUM.PROFILE:
					return <TopNavbarProfilePage title={title} />;
				default:
					return <TopNavbarGeneric title={title} />;
			}
		}, [type]);
		return (
			<Animated.View
				style={{
					backgroundColor: colorScheme.palette.bg,
					height: '100%',
				}}
			>
				{/*<StatusBar backgroundColor={colorScheme.palette.menubar} />*/}
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
				{children}
			</Animated.View>
		);
	},
);

export default AppTopNavbar;
