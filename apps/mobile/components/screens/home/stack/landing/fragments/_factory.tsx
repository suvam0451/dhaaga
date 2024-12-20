import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type SocialHubPinSectionContainer = {
	label: string;
	children: any;
	style?: StyleProp<ViewStyle>;
};
export function SocialHubPinSectionContainer({
	label,
	children,
	style,
}: SocialHubPinSectionContainer) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<View style={[styles.root, style]}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Text
					style={[
						styles.sectionLabel,
						{
							color: theme.secondary.a20,
						},
					]}
				>
					{label}
				</Text>
			</View>

			<View>{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		marginHorizontal: 8,
	},
	sectionLabel: {
		flex: 1,
		marginBottom: 12,
		marginLeft: 6,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	row: {
		flexDirection: 'row',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginBottom: 16,
	},
	item: {
		borderRadius: '100%',
		width: 64,
		height: 64,
		backgroundColor: 'red',
	},
});
