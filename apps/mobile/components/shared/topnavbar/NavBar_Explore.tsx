import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { AppText } from '#/components/lib/Text';

type DropdownProps = {
	items: { id: string; label: string; onSelect: () => void }[];
	isOpen: boolean;
	close: () => void;
};

function NavBar_Explore({ items, isOpen, close }: DropdownProps) {
	const open = useSharedValue(0); // 0 = closed, 1 = open

	useEffect(() => {
		open.value = withTiming(isOpen ? 1 : 0, { duration: 180 });
	}, [isOpen]);

	function onSelect(id: string) {
		close();
		items.find((item) => item.id === id)?.onSelect();
	}

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
							onSelect(item.id);
						}}
					>
						<AppText.H1>{item.label}</AppText.H1>
					</TouchableOpacity>
				))}
			</Animated.View>
		</View>
	);
}

export default NavBar_Explore;

const styles = StyleSheet.create({
	container: {
		width: '100%',
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
		justifyContent: 'center',
		borderBottomWidth: 0.3,
		paddingVertical: 8,
	},
});
