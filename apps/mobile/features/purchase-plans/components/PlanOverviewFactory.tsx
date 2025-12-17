import { View } from 'react-native';
import { NativeTextMedium, NativeTextBold } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppDividerSoft } from '#/ui/Divider';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';

export type PlanOverviewFactoryData =
	| { type: 'feature'; title: string; description: string; Icon: any }
	| {
			type: 'divider';
	  };

type Props = {
	items: PlanOverviewFactoryData[];
	Header: any;
	Footer: any;
	scrollHandler?: any;
};

function PlanOverviewFactory({ items, Header, Footer, scrollHandler }: Props) {
	const { theme } = useAppTheme();
	return (
		<Animated.FlatList
			data={items}
			renderItem={({ item }) => {
				switch (item.type) {
					case 'feature':
						return (
							<View
								key={item.title}
								style={{ flexDirection: 'row', alignItems: 'center' }}
							>
								{item.Icon}
								<View style={{ marginLeft: 8 }}>
									<NativeTextBold
										style={{ fontSize: 20, color: theme.primary }}
										emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
									>
										{item.title}
									</NativeTextBold>
									<NativeTextMedium emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
										{item.description}
									</NativeTextMedium>
								</View>
							</View>
						);
					case 'divider':
						return <AppDividerSoft />;
				}
			}}
			getItemLayout={(data, index) => ({
				length: 48,
				offset: 48 * index,
				index,
			})}
			ItemSeparatorComponent={() => <View style={{ marginVertical: 6 }} />}
			ListHeaderComponent={Header}
			ListFooterComponent={Footer}
			contentContainerStyle={{
				paddingBottom: 20,
				paddingHorizontal: 8,
			}}
			onScroll={scrollHandler}
		/>
	);
}

export default PlanOverviewFactory;
