import { appDimensions } from '#/styles/dimensions';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import { NativeTextMedium } from '#/ui/NativeText';

type Props = {
	onPressAddNew: () => void;
	sectionLabel: string;
	actionButtonLabel: string;
};

/**
 * Shown on top of an assignment matrix
 * (bottom sheet specific component),
 * which allows the user to add a new
 * profile/collection etc. by clicking
 * the cta button
 * @param onPressAddNew
 * @param sectionLabel
 * @param actionButtonLabel
 * @constructor
 */
function AddNewProfile({
	onPressAddNew,
	sectionLabel,
	actionButtonLabel,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<NativeTextMedium
				style={[styles.sectionLabel, { color: theme.secondary.a10 }]}
			>
				{sectionLabel}
			</NativeTextMedium>
			<Pressable onPress={onPressAddNew}>
				<NativeTextMedium
					style={{
						color: theme.primary,
						fontSize: 16,
					}}
				>
					{actionButtonLabel}
				</NativeTextMedium>
			</Pressable>
		</View>
	);
}

export default AddNewProfile;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 16,
		marginBottom: appDimensions.timelines.sectionBottomMargin,
	},
	sectionContainer: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontSize: 20,
		marginBottom: 16,
	},
});
