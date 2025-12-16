import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { AppDividerSoft } from '#/ui/Divider';
import { ReactNode } from 'react';
import { NativeTextMedium } from '#/ui/NativeText';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	items: {
		label: string;
		active: boolean;
		iconId?: string;
		onPress?: () => void;
		onLongPress?: () => void;
	}[];
	ListHeaderComponent?: () => ReactNode;
	ListFooterComponent?: () => ReactNode;
	/**
	 * Applied when there is an absolutely
	 * positioned widget to the left
	 */
	paddingLeft?: number;
	/**
	 * Applied when there is an absolutely
	 * positioned widget to the right
	 */
	paddingRight?: number;
};

function AppSegmentedControl({
	items,
	ListHeaderComponent,
	ListFooterComponent,
	paddingLeft,
	paddingRight,
}: Props) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.root, { backgroundColor: theme.background.a10 }]}>
			<AppDividerSoft />
			<FlatList
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				data={items}
				contentContainerStyle={{
					paddingLeft: paddingLeft ?? 0,
					paddingRight: paddingRight ?? 0,
				}}
				renderItem={({ item }) => (
					<Pressable
						style={{
							paddingVertical: 16,
							paddingHorizontal: 10,
						}}
						onPress={item.onPress}
						onLongPress={item.onLongPress}
					>
						<NativeTextMedium
							style={{
								textAlign: 'center',
								fontSize: 18,
								color: item.active ? theme.primary : theme.secondary.a20,
							}}
						>
							{item.label}
						</NativeTextMedium>
					</Pressable>
				)}
				style={{ flex: 1, width: '100%' }}
				ListHeaderComponent={ListHeaderComponent}
				ListFooterComponent={ListFooterComponent}
			/>

			<AppDividerSoft />
		</View>
	);
}

export default AppSegmentedControl;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		paddingHorizontal: 4,
		width: '100%',
		flex: 1,
		backgroundColor: 'red',
		height: appDimensions.bottomNav.secondMenuBarHeight,
	},
});
