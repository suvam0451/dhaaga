import { useAppTheme } from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { appDimensions } from '#/styles/dimensions';

type Props = {
	title: string;
	menuItems?: {
		iconId: string;
		onPress: () => void;
	}[];
	variant: 'raised' | 'clear';
	CustomHeader?: any;
	style?: StyleProp<ViewStyle>;
};

function BottomSheetMenu({
	title,
	menuItems = [],
	variant,
	CustomHeader,
	style,
}: Props) {
	const { theme } = useAppTheme();
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						variant === 'raised' ? theme.background.a30 : 'transparent',
				},
				style,
			]}
		>
			{CustomHeader ? (
				CustomHeader
			) : (
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_700_BOLD,
						color: theme.textColor.high,
						fontSize: 20,
						flex: 1,
					}}
				>
					{title}
				</Text>
			)}
			<View style={{ flexDirection: 'row' }}>
				{menuItems.map((o, i) => (
					<Pressable
						key={i}
						style={{
							paddingHorizontal: 8,
						}}
						onPress={o.onPress}
					>
						<AppIcon
							id={o.iconId as APP_ICON_ENUM}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							onPress={o.onPress}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default BottomSheetMenu;

const styles = StyleSheet.create({
	container: {
		paddingBottom: 16,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingHorizontal: 16,
		alignItems: 'center',
		marginTop: 0,
		paddingTop: 32,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
	},
});
