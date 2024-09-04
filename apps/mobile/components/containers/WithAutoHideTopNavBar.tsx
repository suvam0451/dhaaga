import { APP_THEME } from '../../styles/AppTheme';
import { Animated, StyleSheet } from 'react-native';
import AppHeaderStackPage from '../headers/AppHeaderStackPage';

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY?: Animated.AnimatedInterpolation<string | number>;
};

/**
 * The header will auto-hide.
 *
 * NOTE: Does not come with ScrollView
 * @param title
 * @param children
 * @param translateY
 * @constructor
 */
function WithAutoHideTopNavBar({
	title,
	children,
	translateY,
}: AutoHideNavBarProps) {
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
				<AppHeaderStackPage title={title} />
			</Animated.View>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	root: {
		height: '100%',
		backgroundColor: APP_THEME.BACKGROUND,
		// paddingTop: 54,
	},
	nav: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
	},
});

export default WithAutoHideTopNavBar;
