import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import { Pressable, StyleSheet, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppText } from '#/components/lib/Text';
import { NativeTextH6 } from '#/ui/NativeText';

type Props = {
	label: string;
	desc: string;
	iconId: APP_ICON_ENUM;
	onPress: () => void;
};

function AccountHomeModuleItem({ label, desc, iconId, onPress }: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.appModuleContainer}>
			<Pressable
				style={[
					styles.appModuleContent,
					{
						backgroundColor: theme.background.a40, // '#282828',
					},
				]}
				onPress={onPress}
			>
				<View style={styles.tiltedIconContainer}>
					<AppIcon
						id={iconId}
						size={appDimensions.socialHub.feeds.tiltedIconSize}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						iconStyle={{ color: theme.secondary.a0 }}
					/>
				</View>
				<NativeTextH6
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					color={theme.complementary.a0}
				>
					{label}
				</NativeTextH6>
				<AppText.Medium
					style={{
						width: 96,
						color: theme.secondary.a40,
					}}
					numberOfLines={1}
				>
					{desc}
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

export default AccountHomeModuleItem;

const styles = StyleSheet.create({
	appModuleContainer: {
		maxWidth: '50%',
		flex: 1,
		paddingHorizontal: 6,
	},
	appModuleContent: {
		paddingVertical: 10,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
		marginBottom: 12,
		overflow: 'hidden',
		width: 'auto',
	},
	tiltedIconContainer: {
		transform: [{ rotateZ: '-15deg' }],
		width: 42,
		position: 'absolute',
		opacity: 0.48,
		right: 0,
		bottom: -6,
	},
});
