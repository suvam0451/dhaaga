import { Dispatch, memo, SetStateAction } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

type PopularServersDto = {
	label: string;
	items: {
		value: string;
		label: string;
	}[];
	onSelect: Dispatch<SetStateAction<string>>;
};

const PopularServers = memo(({ label, items, onSelect }: PopularServersDto) => {
	return (
		<View>
			<Text style={styles.sectionHeaderText}>{label}</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{items.map((item, i) => (
					<TouchableOpacity
						onPress={() => {
							onSelect(item.value);
						}}
					>
						<View
							style={{
								padding: 8,
								margin: 4,
								backgroundColor: APP_THEME.CARD_BACKGROUND_DARKEST,
								borderRadius: 4,
							}}
						>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_HEADER,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									opacity: 0.75,
								}}
							>
								{item.label}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
});

export default PopularServers;

const styles = StyleSheet.create({
	sectionHeaderText: {
		marginTop: 32,
		marginBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
