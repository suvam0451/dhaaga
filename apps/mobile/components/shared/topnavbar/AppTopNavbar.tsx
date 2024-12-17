import { memo, useMemo } from 'react';
import { Animated } from 'react-native';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import TopNavbarLandingGeneric from './fragments/TopNavbarLandingGeneric';
import TimelinesHeader from './fragments/TopNavbarTimelineStack';
import NotificationsHeader from './fragments/TopNavbarNotificationStack';
import TopNavbarProfilePage from './fragments/TopNavbarProfilePage';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../states/_global';

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
	onRefresh?: () => void;
};

const AppTopNavbar = memo(
	({
		title,
		children,
		translateY,
		type = APP_TOPBAR_TYPE_ENUM.GENERIC,
	}: AutoHideNavBarProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

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
				{children}
			</Animated.View>
		);
	},
);

export default AppTopNavbar;
