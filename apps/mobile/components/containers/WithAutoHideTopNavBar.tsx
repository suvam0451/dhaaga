import { APP_THEME } from '../../styles/AppTheme';
import { Animated, StyleSheet } from 'react-native';
import TopNavbarGeneric from '../shared/topnavbar/fragments/TopNavbarGeneric';

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
				<TopNavbarGeneric title={title} />
			</Animated.View>
			{children}
		</Animated.View>
	);
}

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

export default WithAutoHideTopNavBar;
