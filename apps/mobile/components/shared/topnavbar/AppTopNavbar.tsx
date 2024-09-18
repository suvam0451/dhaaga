import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import TopNavbarLandingGeneric from './fragments/TopNavbarLandingGeneric';
import TimelinesHeader from './fragments/TopNavbarTimelineStack';
import NotificationsHeader from './fragments/TopNavbarNotificationStack';
import TopNavbarProfilePage from './fragments/TopNavbarProfilePage';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

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
				style={[styles.root, { backgroundColor: colorScheme.palette.bg }]}
			>
				<Animated.View
					style={[
						styles.nav,
						{
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

const styles = StyleSheet.create({
	root: {
		height: '100%',
		backgroundColor: APP_THEME.BACKGROUND,
	},
	nav: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
	},
});

export default AppTopNavbar;
