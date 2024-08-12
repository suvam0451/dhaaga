import { View, Text, StyleSheet } from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';
import { memo } from 'react';

type NoResultsProps = {
	text: string;
	subtext: string;
};

const NoResults = memo(({ text, subtext }: NoResultsProps) => {
	return (
		<View style={styles.rootContainer}>
			<View style={styles.container}>
				<Text style={styles.mainText}>{text}</Text>
				<Text style={styles.subText}>{subtext}</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 16,
		padding: 16,
	},
	container: {
		borderWidth: 1,
		borderColor: '#ffffff60',
		padding: 16,
		borderRadius: 16,
		display: 'flex',
		alignItems: 'center',
		maxWidth: 360,
	},
	mainText: {
		fontSize: 24,
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	subText: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default NoResults;
