import { Button, Text } from '@rneui/themed';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';

type AppButtonFollowIndicatorProps = {
	isCompleted: boolean;
	onClick: () => void;
	activeLabel: string;
	passiveLabel: string;
	size?: 'lg' | 'sm' | 'md';
	loading: boolean;
};

function AppButtonFollowIndicator({
	isCompleted,
	onClick,
	activeLabel,
	passiveLabel,
	size,
	loading,
}: AppButtonFollowIndicatorProps) {
	function onButtonClick() {
		if (!loading) {
			onClick();
		}
	}

	const _size = size || 'md';
	return isCompleted ? (
		<Button
			size={_size}
			onPress={onButtonClick}
			buttonStyle={styles.activeButtonStyle}
		>
			{loading ? (
				<ActivityIndicator size={20} color={APP_THEME.COLOR_SCHEME_D_NORMAL} />
			) : (
				<Text style={styles.activeTextStyle}>{activeLabel}</Text>
			)}
		</Button>
	) : (
		<Button
			size={_size}
			onPress={onButtonClick}
			buttonStyle={styles.passiveButtonStyle}
		>
			{loading ? (
				<ActivityIndicator size={20} color={APP_THEME.COLOR_SCHEME_D_NORMAL} />
			) : (
				<Text style={styles.passiveTextStyle}>{passiveLabel}</Text>
			)}
		</Button>
	);
}

const styles = StyleSheet.create({
	passiveButtonStyle: {
		borderColor: 'red',
		backgroundColor: '#2e6945', // '#cb6483',
		maxWidth: 128,
	},
	activeButtonStyle: {
		borderColor: '#cb6483',
		backgroundColor: 'rgba(39, 39, 39, 1)',
		maxWidth: 128,
	},
	passiveTextStyle: {
		fontFamily: 'Montserrat-SemiBold',
		color: APP_FONT.MONTSERRAT_HEADER,
	},
	activeTextStyle: {
		fontFamily: 'Montserrat-Bold',
		color: '#cb6483',
		opacity: 0.87,
	},
});

export default AppButtonFollowIndicator;
