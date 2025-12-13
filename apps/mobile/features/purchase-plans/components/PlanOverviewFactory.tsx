import { FlatList, View } from 'react-native';
import { NativeTextMedium } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppDividerSoft } from '#/ui/Divider';
import Animated from 'react-native-reanimated';

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
									<NativeTextMedium
										style={{ fontSize: 20 }}
										emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
									>
										{item.title}
									</NativeTextMedium>
									<NativeTextMedium
										style={{ marginTop: 4 }}
										emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
									>
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
