import { Animated, StyleSheet } from 'react-native';
import TopNavbarGeneric from '../shared/topnavbar/fragments/TopNavbarGeneric';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

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
	const { theme } = useAppTheme();
	return (
		<Animated.View
			style={[
				styles.root,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
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
				<TopNavbarGeneric title={title} />
			</Animated.View>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	root: {
		height: '100%',
	},
	nav: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
	},
});

export default WithAutoHideTopNavBar;
