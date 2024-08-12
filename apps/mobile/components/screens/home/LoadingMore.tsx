import {
	View,
	ActivityIndicator,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { memo } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

type LoadingMoreProps = {
	visible: boolean;
	loading: boolean;
	style?: StyleProp<ViewStyle>;
};

const LoadingMore = memo(({ visible, loading, style }: LoadingMoreProps) => {
	if (!visible) return <View />;
	if (visible && loading)
		return (
			<View style={[styles.widgetRootContainer, style]}>
				<View style={styles.widgetContainer}>
					<ActivityIndicator size="small" color="#ffffff87" />
					<Text style={styles.text}>{'Loading More...'}</Text>
				</View>
			</View>
		);
	return <View />;
});

const styles = StyleSheet.create({
	widgetRootContainer: {
		position: 'absolute',
		height: 64,
		width: '100%',
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	widgetContainer: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'rgba(64,64,64,0.75)',
		padding: 8,
		borderRadius: 8,
	},
	text: {
		color: APP_FONT.MONTSERRAT_BODY,
		textAlign: 'center',
		marginLeft: 6,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default LoadingMore;
