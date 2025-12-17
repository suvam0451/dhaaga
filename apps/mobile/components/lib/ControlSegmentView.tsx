import { View, StyleSheet, FlatList } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { NativeTextBold } from '#/ui/NativeText';

type Props = {
	label?: string;
	buttons: {
		id: string;
		label: string;
		onClick: () => void;
	}[];
	selection: string;
	activeForeground?: string;
	activeBackground?: string;
	inactiveForeground?: string;
	inactiveBackground?: string;
};

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

/**
 *
 * @param label (optional) a label for this control section
 * @param buttons
 * @param selection
 * @param activeForeground
 * @param activeBackground
 * @param inactiveForeground
 * @param inactiveBackground
 * @constructor
 */
function ControlSegmentView({
	label,
	buttons,
	selection,
	activeForeground,
	activeBackground,
	inactiveForeground,
	inactiveBackground,
}: Props) {
	const { theme } = useAppTheme();

	const _activeForeground = activeForeground || 'black';
	const _activeBackground = activeBackground || theme.primary;
	const _inactiveForeground = inactiveForeground || theme.secondary.a20;
	const _inactiveBackground = inactiveBackground || '#2c2c2c';

	return (
		<View style={styles.root}>
			{label && (
				<NativeTextBold
					style={[
						styles.label,
						{
							color: theme.secondary.a10,
						},
					]}
				>
					{label}
				</NativeTextBold>
			)}
			<FlatList
				data={buttons}
				horizontal={true}
				renderItem={({ item: o }) => (
					<View
						style={[
							styles.buttonContainer,
							{
								backgroundColor:
									selection === o.id ? _activeBackground : _inactiveBackground,
							},
						]}
						onTouchEnd={o.onClick}
					>
						<NativeTextBold
							style={{
								color:
									selection === o.id ? _activeForeground : _inactiveForeground,
							}}
						>
							{o.label}
						</NativeTextBold>
					</View>
				)}
			/>
		</View>
	);
}

export default ControlSegmentView;

const styles = StyleSheet.create({
	root: { marginBottom: MARGIN_BOTTOM * 2.5 },
	label: {
		marginBottom: MARGIN_BOTTOM * 1.5,
		fontSize: 16,
	},
	buttonContainer: {
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 16,
		marginRight: 8,
	},
});
