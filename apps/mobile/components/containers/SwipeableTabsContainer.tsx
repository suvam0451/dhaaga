import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { BottomNavBar } from '../shared/pager-view/BottomNavBar';
import { useRef, useState } from 'react';

type SwipeableTabsContainerProps = {
	pages: { label: string; id: string }[];
	renderScene: (idx: number) => any;
};

function SwipeableTabsContainer({
	renderScene,
	pages,
}: SwipeableTabsContainerProps) {
	const [Index, setIndex] = useState(0);
	const ref = useRef<PagerView>(null);
	const { theme } = useAppTheme();

	const onChipSelect = (index: number) => {
		if (Index !== index) {
			setIndex(index);
			ref.current?.setPage(index);
		}
	};

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<PagerView ref={ref} style={{ flex: 1 }} initialPage={0}>
				{Array.from({ length: pages.length }).map((_, index) => (
					<View key={index.toString()}>{renderScene(index)}</View>
				))}
			</PagerView>
			<BottomNavBar
				Index={Index}
				setIndex={onChipSelect}
				items={pages}
				justify={'space-around'}
			/>
		</View>
	);
}
export default SwipeableTabsContainer;
