import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { NativeTextH1 } from '#/ui/NativeText';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

type DropdownProps = {
	items: { id: string; label: string; onSelect: () => void }[];
	selectedItemId: string;
	isOpen: boolean;
	close: () => void;
};

function NavBar_Explore({
	items,
	isOpen,
	close,
	selectedItemId,
}: DropdownProps) {
	const open = useSharedValue(0); // 0 = closed, 1 = open
	const { theme } = useAppTheme();

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
			marginBottom: withTiming(open.value === 1 ? 32 : 0),
		};
	});

	return (
		<View style={styles.container}>
			<Animated.View style={[animatedStyle]}>
				{items.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.item}
						onPress={() => {
							onSelect(item.id);
						}}
					>
						<NativeTextH1
							color={item.id === selectedItemId ? theme.primary.a0 : undefined}
						>
							{item.label}
						</NativeTextH1>
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
	item: {
		justifyContent: 'center',
		borderBottomWidth: 0.3,
		paddingVertical: 8,
	},
});
