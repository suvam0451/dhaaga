import { StyleSheet } from 'react-native';

const appStyling = StyleSheet.create({
	// sample text
	inputAssistant: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		// marginHorizontal: 4,
		marginBottom: 20, // 24,
		paddingHorizontal: 12,
		// borderRadius: 8
		zIndex: 99,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginVertical: 8,
		borderRadius: 8,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		width: 148,
	},
});

export default appStyling;
