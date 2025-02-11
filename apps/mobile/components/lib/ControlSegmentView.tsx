import { View, StyleSheet, FlatList } from 'react-native';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { AppText } from './Text';
import { appDimensions } from '../../styles/dimensions';

type Props = {
	label?: string;
	buttons: {
		lookupId: string;
		label: string;
		onClick: () => void;
	}[];
	selection: Set<string>;
	hash: string;
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
	const _activeBackground = activeBackground || theme.primary.a0;
	const _inactiveForeground = inactiveForeground || theme.secondary.a20;
	const _inactiveBackground = inactiveBackground || '#2c2c2c';

	return (
		<View style={styles.root}>
			{label && (
				<AppText.SemiBold
					style={[
						styles.label,
						{
							color: theme.secondary.a10,
						},
					]}
				>
					{label}
				</AppText.SemiBold>
			)}
			<FlatList
				data={buttons}
				horizontal={true}
				renderItem={({ item: o }) => (
					<View
						style={[
							styles.buttonContainer,
							{
								backgroundColor: selection.has(o.lookupId)
									? _activeBackground
									: _inactiveBackground,
							},
						]}
						onTouchEnd={o.onClick}
					>
						<AppText.SemiBold
							style={{
								color: selection.has(o.lookupId)
									? _activeForeground
									: _inactiveForeground,
							}}
						>
							{o.label}
						</AppText.SemiBold>
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
