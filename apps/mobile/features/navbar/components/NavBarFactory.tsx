import { ReactNode } from 'react';
import { appDimensions } from '#/styles/dimensions';
import {
	View,
	StyleSheet,
	Pressable,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { NativeTextH1 } from '#/ui/NativeText';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	labelText?: string;
	/**
	 * Use this when we need
	 * custom behavior for the
	 * label area (e.g. - The header
	 * component in Dhaaga Hub)
	 */
	LabelComponent?: ReactNode;
	/**
	 * animates, as per the scroll view
	 * in the page
	 */
	animatedStyle?: StyleProp<ViewStyle>;

	menuItems: {
		iconId: string;
		onPress: () => void;
		hidden?: boolean;
	}[];
};

/**
 * The navigation bar for all landing
 * pages should have:
 *
 * - fixed height (64 px)
 * - no back button
 * - either, a legible module label
 * - or, a component with label and
 * description, which must act as
 * some form of status indicator for
 * that page
 *
 * This navbar is also designed to move
 * with the container
 * @constructor
 */
function NavBarFactory({
	labelText,
	LabelComponent,
	menuItems,
	animatedStyle,
}: Props) {
	const { theme } = useAppTheme();
	return (
		<Animated.View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a10,
				},
				animatedStyle,
			]}
		>
			<View style={{ flex: 1, flexDirection: 'row' }}>
				{LabelComponent ? (
					LabelComponent
				) : (
					<NativeTextH1>{labelText}</NativeTextH1>
				)}
			</View>

			<View style={{ flexDirection: 'row' }}>
				{menuItems.map(({ iconId, onPress, hidden }, i) =>
					hidden ? (
						<View key={i} />
					) : (
						<Pressable
							key={i}
							style={{
								padding: appDimensions.topNavbar.padding,
								marginLeft: appDimensions.topNavbar.marginLeft,
							}}
							onPress={onPress}
						>
							<AppIcon
								id={iconId as any}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								onPress={onPress}
								size={appDimensions.topNavbar.iconSize + 6}
							/>
						</Pressable>
					),
				)}
			</View>
		</Animated.View>
	);
}

export default NavBarFactory;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		height: appDimensions.topNavbar.hubVariantHeight,
		position: 'absolute',
		zIndex: 1,
	},
});
