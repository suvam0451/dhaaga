import { appDimensions } from '#/styles/dimensions';
import { AppText } from '#/components/lib/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';

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
function AssignmentListControlView({
	onPressAddNew,
	sectionLabel,
	actionButtonLabel,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<AppText.Medium
				style={[styles.sectionLabel, { color: theme.secondary.a10 }]}
			>
				{sectionLabel}
			</AppText.Medium>
			<Pressable onPress={onPressAddNew}>
				<AppText.Medium
					style={{
						color: theme.primary.a0,
						fontSize: 16,
					}}
				>
					{actionButtonLabel}
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

export default AssignmentListControlView;

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
	tipText: {
		textAlign: 'center',
		marginBottom: 8,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		maxWidth: 396,
		alignSelf: 'center',
	},
});
