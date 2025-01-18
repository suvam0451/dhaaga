import { StyleProp, View, ViewStyle } from 'react-native';

const TaperedArrow = ({ direction }: { direction: 'top' | 'bottom' }) => {
	const containerStyle: StyleProp<ViewStyle> = {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	};
	const arrowStyle: StyleProp<ViewStyle> =
		direction === 'top'
			? {
					width: 0,
					height: 0,
					left: 8,
					borderLeftWidth: 12, // Left side of the triangle
					borderRightWidth: 12, // Right side of the triangle
					borderTopWidth: 10, // Height of the triangle
					borderLeftColor: 'transparent', // No color for left side
					borderRightColor: 'transparent', // No color for right side
					borderTopColor: '#282828', // Color of the arrow (bottom)
				}
			: {
					width: 0,
					height: 0,
					left: 8,
					borderLeftWidth: 12, // Left side of the triangle
					borderRightWidth: 12, // Right side of the triangle
					borderBottomWidth: 10, // Height of the triangle
					borderLeftColor: 'transparent', // No color for left side
					borderRightColor: 'transparent', // No color for right side
					borderBottomColor: '#282828', // Color of the arrow (bottom)
				};

	return (
		<View style={containerStyle}>
			<View style={arrowStyle} />
		</View>
	);
};

export default TaperedArrow;
