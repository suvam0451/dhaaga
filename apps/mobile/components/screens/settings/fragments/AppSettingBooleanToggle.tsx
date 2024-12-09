import { memo } from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { AppSetting } from '../../../../entities/app-settings.entity';

type AppSettingBooleanToggleProps = {
	label: string;
	subtext?: string;
	settingKey: string;
	style?: StyleProp<ViewStyle>;
};

const UNCHECKED_BG_COLOR = '#282828';

const AppSettingBooleanToggle = memo(
	({ label, subtext, style, settingKey }: AppSettingBooleanToggleProps) => {
		const setting: AppSetting = null;

		const IS_CHECKED = setting?.value === '1';

		return (
			<View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
				<View style={{ flex: 1, flexGrow: 1 }}>
					<Text style={styles.label}>{label}</Text>
					{subtext && <Text style={styles.subtext}>{subtext}</Text>}
				</View>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						borderRadius: 8,
						marginLeft: 8,
					}}
					onPress={() => {}}
				>
					<View
						style={{
							borderRadius: 8,
							padding: 8,
							paddingVertical: 6,
							borderBottomEndRadius: 0,
							borderTopRightRadius: 0,
							backgroundColor: IS_CHECKED ? UNCHECKED_BG_COLOR : '#888',
						}}
					>
						<Entypo
							name="cross"
							size={24}
							color={IS_CHECKED ? APP_FONT.DISABLED : APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
					<View
						style={{
							borderRadius: 4,
							padding: 8,
							paddingVertical: 6,
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0,
							backgroundColor: IS_CHECKED ? '#23639f' : UNCHECKED_BG_COLOR,
						}}
					>
						<Feather
							name="check"
							size={24}
							color={IS_CHECKED ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED}
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	},
);

export default AppSettingBooleanToggle;

const styles = StyleSheet.create({
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		width: '100%',
	},
	label: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 18,
		color: APP_FONT.MONTSERRAT_HEADER,
	},
	subtext: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 14,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	sectionLabel: {
		fontSize: 13,
		color: APP_FONT.MONTSERRAT_BODY,
		opacity: 0.87,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		marginVertical: 16,
	},
});
