import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../styles/AppTheme';
import { memo } from 'react';

type TimelineLoadingProps = {
	label?: string;
};

const TimelineLoading = memo(({ label }: TimelineLoadingProps) => {
	const _label = label || 'Loading Timeline';
	return (
		<View style={styles.containerWrapper}>
			<View style={styles.container}>
				<Text style={styles.titleText}>{_label}</Text>
				<View style={{ marginTop: 16 }}>
					<ActivityIndicator size={24} />
				</View>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	containerWrapper: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 50,
		padding: 16,
		backgroundColor: '#121212',
		height: '100%',
	},
	container: {
		borderWidth: 1,
		borderColor: '#ffffff60',
		padding: 16,
		borderRadius: 16,
		display: 'flex',
		alignItems: 'center',
	},
	titleText: {
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_HEADER,
		fontFamily: 'Montserrat-Bold',
		textAlign: 'center',
	},
});

export default TimelineLoading;
