import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	widgetContainerCollapsed: {
		marginBottom: 16,
		backgroundColor: 'rgba(54,54,54,1)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
		zIndex: 99,
	},
	widgetContainerCollapsedCore: {
		marginBottom: 16,
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		flexDirection: 'row-reverse',
		alignItems: 'center',
	},
	widgetContainerCollapsedCButton: {
		backgroundColor: 'rgba(54,54,54,0.85)',
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},
});
