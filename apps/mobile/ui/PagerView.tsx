import { ReactElement, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useLocalSearchParams } from 'expo-router';
import AppSegmentedControl from '#/ui/AppSegmentedControl';

type AppPagerViewProps = {
	tabCount: number;
	renderScene: (index: number) => ReactElement;
	labels: { label: string; id: string }[] /**
	 * whether the floating bottom navbar should be shown
	 * for this PagerView
	 */;
	showBottomNav?: boolean;
	props?: StyleProp<ViewStyle>;
	scrollEnabled: boolean;
};

function AppPagerView({
	tabCount,
	renderScene,
	labels,
	props,
	scrollEnabled,
}: AppPagerViewProps) {
	const [TabIndex, setTabIndex] = useState(0);
	const ref = useRef<PagerView>(null);
	const { theme } = useAppTheme();

	const params = useLocalSearchParams();
	const _requestId: string = params['requestId'] as string;
	const _pagerIndex: string = params['pagerIndex'] as string;

	useEffect(() => {
		if (!_pagerIndex) return;
		ref.current.setPage(Number(_pagerIndex));
	}, [_requestId]);

	function onPagerViewScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setTabIndex(nextIdx);
	}

	function onChipSelected(index: number) {
		if (TabIndex !== index) {
			ref.current.setPage(index);
		}
	}

	const mappedActions = labels.map((label, i) => ({
		label: label.label,
		active: i === TabIndex,
		onPress: () => onChipSelected(i),
	}));

	return (
		<>
			<PagerView
				ref={ref}
				scrollEnabled={scrollEnabled}
				style={[{ flex: 1, backgroundColor: theme.background.a10 }, props]}
				initialPage={TabIndex}
				onPageScroll={onPagerViewScroll}
				collapsable={false}
			>
				{Array.from({ length: tabCount }).map((_, index) => (
					<View key={index} style={{ flex: 1 }}>
						{renderScene(index)}
					</View>
				))}
			</PagerView>
			<AppSegmentedControl items={mappedActions} />
		</>
	);
}

export { AppPagerView };
