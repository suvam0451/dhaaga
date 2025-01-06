import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../../../../../hooks/utility/global-state-extractors';
import { AppIcon } from '../../../../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

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
	const { theme } = useAppTheme();

	return (
		<View style={[styles.root, style]}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 8,
				}}
			>
				<Text
					style={[
						styles.sectionLabel,
						{
							color: theme.secondary.a10,
							fontFamily: APP_FONTS.BEBAS_NEUE_400,
							fontSize: 32,
						},
					]}
				>
					{label}
				</Text>

				<AppIcon
					id={'add'}
					containerStyle={{ padding: 6 }}
					onPress={() => {}}
					size={28}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				/>
			</View>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		marginHorizontal: 8,
		flexShrink: 1,
	},
	sectionLabel: {
		flex: 1,

		marginLeft: 6,
		fontSize: 16,
		// fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		// fontWeight: 'bold',
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
