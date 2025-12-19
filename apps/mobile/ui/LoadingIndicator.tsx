import {
	View,
	ActivityIndicator,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import useLoadingMoreIndicatorState from '../states/useLoadingMoreIndicatorState';
import { FetchStatus } from '@tanstack/react-query';
import { NativeTextBold } from '#/ui/NativeText';

type LoadingMoreProps = {
	numItems: number;
	networkFetchStatus: FetchStatus;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
};

/**
 * Loading indicator for timeline
 * @param networkFetchStatus
 * @param isLoading
 * @param style
 * @param numItems = 0 is handled by the skeleton
 * placeholder and error indicator components
 * @constructor
 */
function TimelineLoadingIndicator({
	networkFetchStatus,
	isLoading,
	style,
	numItems,
}: LoadingMoreProps) {
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus: networkFetchStatus,
		additionalLoadingStates: isLoading,
	});

	const { theme } = useAppTheme();
	if (!visible || numItems === 0) return <View />;
	if (visible && loading)
		return (
			<View style={[styles.root, style]}>
				<View
					style={[
						styles.widgetContainer,
						{ backgroundColor: theme.background.a30 },
					]}
				>
					<ActivityIndicator size="small" color="#ffffff87" />
					<NativeTextBold
						style={[
							styles.text,
							{
								color: theme.secondary.a20,
							},
						]}
					>
						{'Loading More...'}
					</NativeTextBold>
				</View>
			</View>
		);
	return <View />;
}

const styles = StyleSheet.create({
	root: {
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
	},
});

export { TimelineLoadingIndicator };
