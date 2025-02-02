import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_FONTS } from '../../../styles/AppFonts';
import { router } from 'expo-router';

type Props = {
	label: string;
	desc?: string;
	preview?: string;
	to: string;
};

function SettingWithNav({ label, desc, preview, to }: Props) {
	function onPress() {
		router.navigate(to);
	}

	return (
		<View style={styles.settingItemContainer}>
			<View>
				<AppText.Medium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					{label}
				</AppText.Medium>
				{desc && (
					<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						{desc}
					</AppText.Normal>
				)}
			</View>

			<View style={{ flex: 1 }} />
			{preview && (
				<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
					{preview}
				</AppText.Medium>
			)}
			<AppIcon id={'chevron-right'} size={28} onPress={onPress} />
		</View>
	);
}

export default SettingWithNav;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
	settingItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 28,
		marginVertical: 10,
	},
});
