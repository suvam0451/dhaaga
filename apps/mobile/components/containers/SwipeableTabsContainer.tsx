import { View } from 'react-native';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { BottomNavBar } from '../shared/pager-view/BottomNavBar';
import { useState } from 'react';
import { AppPagerView } from '../lib/AppPagerView';

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

	const onChipSelect = (index: number) => {
		if (Index !== index) {
			setIndex(index);
		}
	};

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<AppPagerView
				pageCount={pages.length}
				renderFunction={renderScene}
				onPageChangeCallback={onChipSelect}
			/>
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
