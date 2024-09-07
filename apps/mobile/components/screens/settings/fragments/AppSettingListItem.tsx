import { memo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

type AppSettingListItemProps = {
	label: string;
	subtext?: string;
	children: React.ReactNode;
};

const AppSettingListItem = memo(
	({ label, subtext, children }: AppSettingListItemProps) => {
		const [Expanded, setExpanded] = useState(false);
		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						setExpanded((o) => !o);
					}}
				>
					<View style={styles.listItem}>
						<View style={{ flex: 1, flexGrow: 1 }}>
							<Text style={styles.label}>{label}</Text>
							{subtext && <Text style={styles.subtext}>{subtext}</Text>}
						</View>
						<View style={{ paddingLeft: 16 }}>
							{Expanded ? (
								<Entypo
									name="chevron-down"
									size={24}
									color={APP_FONT.MONTSERRAT_HEADER}
								/>
							) : (
								<Entypo
									name="chevron-right"
									size={24}
									color={APP_FONT.MONTSERRAT_HEADER}
								/>
							)}
						</View>
					</View>
				</TouchableOpacity>
				{Expanded && (
					<View style={{ paddingHorizontal: 8, marginTop: 16 }}>
						{children}
					</View>
				)}
			</View>
		);
	},
);

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

export default AppSettingListItem;
