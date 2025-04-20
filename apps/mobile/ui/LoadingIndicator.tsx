import {
	View,
	ActivityIndicator,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '../styles/AppFonts';
import { useAppTheme } from '../hooks/utility/global-state-extractors';
import useLoadingMoreIndicatorState from '../states/useLoadingMoreIndicatorState';
import { FetchStatus } from '@tanstack/react-query';

type LoadingMoreProps = {
	networkFetchStatus: FetchStatus;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
};

/**
 * Loading indicator for timeline
 * @param networkFetchStatus
 * @param isLoading
 * @param style
 * @constructor
 */
function TimelineLoadingIndicator({
	networkFetchStatus,
	isLoading,
	style,
}: LoadingMoreProps) {
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus: networkFetchStatus,
		additionalLoadingStates: isLoading,
	});

	const { theme } = useAppTheme();
	if (!visible) return <View />;
	if (visible && loading)
		return (
			<View style={[styles.widgetRootContainer, style]}>
				<View
					style={[
						styles.widgetContainer,
						{ backgroundColor: theme.palette.menubar },
					]}
				>
					<ActivityIndicator size="small" color="#ffffff87" />
					<Text
						style={[
							styles.text,
							{
								color: theme.secondary.a20,
							},
						]}
					>
						{'Loading More...'}
					</Text>
				</View>
			</View>
		);
	return <View />;
}

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
		padding: 8,
		borderRadius: 8,
	},
	text: {
		textAlign: 'center',
		marginLeft: 6,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export { TimelineLoadingIndicator };
