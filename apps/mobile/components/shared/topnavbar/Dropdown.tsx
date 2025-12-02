import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { AppText } from '#/components/lib/Text';

const Dropdown = ({ items = [], isOpen }) => {
	const [selected, setSelected] = useState(null);

	const open = useSharedValue(0); // 0 = closed, 1 = open

	useEffect(() => {
		open.value = withTiming(isOpen ? 1 : 0, { duration: 180 });
	}, [isOpen]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: withTiming(open.value === 1 ? items.length * 45 : 0, {
				duration: 300,
			}),
			opacity: open.value,
			marginBottom: withTiming(open.value === 1 ? 16 : 0),
		};
	});

	return (
		<View style={styles.container}>
			{/* Dropdown Items */}
			<Animated.View style={[styles.dropdown, animatedStyle]}>
				{items.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.item}
						onPress={() => {
							setSelected(item);
						}}
					>
						<AppText.H1>{item.label}</AppText.H1>
					</TouchableOpacity>
				))}
			</Animated.View>
		</View>
	);
};

export default Dropdown;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		// marginVertical: 20,
		alignSelf: 'center',
		zIndex: 99,
	},
	header: {
		backgroundColor: '#eee',
		padding: 15,
		borderRadius: 6,
		elevation: 2,
	},
	headerText: {
		fontSize: 16,
	},
	dropdown: {},
	item: {
		// height: 45,
		justifyContent: 'center',
		// paddingHorizontal: 15,
		borderBottomWidth: 0.3,
		// borderBottomColor: 'gray',
		paddingVertical: 8,
		// backgroundColor: 'red',
	},
});
