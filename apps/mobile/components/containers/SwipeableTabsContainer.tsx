import { View } from 'react-native';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { BottomNavBar } from '../shared/pager-view/BottomNavBar';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';

type SwipeableTabsContainerProps = {
	pages: { label: string; id: string }[];
	renderScene: (idx: number) => any;
};

function SwipeableTabsContainer({
	renderScene,
	pages,
}: SwipeableTabsContainerProps) {
	const [Index, setIndex] = useState(0);
	const { theme } = useAppTheme();

	const ref = useRef<PagerView>(null);
	const onChipSelect = (index: number) => {
		if (Index !== index) {
			ref.current.setPage(index);
		}
	};

	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setIndex(nextIdx);
	}

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<PagerView
				ref={ref}
				scrollEnabled={true}
				style={{ flex: 1 }}
				initialPage={Index}
				onPageScroll={onPageScroll}
			>
				{Array.from({ length: pages.length }).map((_, index) => (
					<View key={index}>{renderScene(index)}</View>
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
