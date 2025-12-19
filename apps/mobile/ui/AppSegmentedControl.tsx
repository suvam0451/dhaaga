import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { AppDividerSoft } from '#/ui/Divider';
import { ReactNode } from 'react';
import { NativeTextBold } from '#/ui/NativeText';
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

	RightWidget: ReactNode;
	LeftWidget: ReactNode;
};

function AppSegmentedControl({
	items,
	ListHeaderComponent,
	ListFooterComponent,
	paddingLeft,
	paddingRight,

	RightWidget,
	LeftWidget,
}: Props) {
	const { theme } = useAppTheme();
	return (
		<View style={[styles.root, { backgroundColor: theme.background.a10 }]}>
			{/*<AppDividerSoft />*/}
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
							paddingHorizontal: 10,
						}}
						onPress={item.onPress}
						onLongPress={item.onLongPress}
					>
						<NativeTextBold
							style={{
								textAlign: 'center',
								fontSize: 18,
								marginVertical: 'auto',
								color: item.active ? theme.primary : theme.secondary.a20,
							}}
						>
							{item.label}
						</NativeTextBold>
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
