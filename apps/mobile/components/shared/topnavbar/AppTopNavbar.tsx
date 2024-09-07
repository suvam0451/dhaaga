import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import TopNavbarLandingGeneric from './fragments/TopNavbarLandingGeneric';
import TimelinesHeader from './fragments/TopNavbarTimelineStack';

export enum APP_TOPBAR_TYPE_ENUM {
	GENERIC,
	TIMELINE,
	LANDING_GENERIC,
}

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY: Animated.AnimatedInterpolation<string | number>;
	type: APP_TOPBAR_TYPE_ENUM;
};

const AppTopNavbar = memo(
	({ title, children, translateY, type }: AutoHideNavBarProps) => {
		const Header = useMemo(() => {
			switch (type) {
				case APP_TOPBAR_TYPE_ENUM.GENERIC:
					return <TopNavbarGeneric title={title} />;
				case APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC:
					return <TopNavbarLandingGeneric title={title} />;
				case APP_TOPBAR_TYPE_ENUM.TIMELINE:
					return <TimelinesHeader title={title} />;
				default:
					return <TopNavbarGeneric title={title} />;
			}
		}, [type]);
		return (
			<Animated.View style={styles.root}>
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
