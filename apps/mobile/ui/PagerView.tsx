import { ReactElement, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import {
	FlatList,
	StyleProp,
	View,
	ViewStyle,
	StyleSheet,
	Dimensions,
} from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useLocalSearchParams } from 'expo-router';
import AppSegmentedControl from '#/ui/AppSegmentedControl';
import { NativeTextMedium } from '#/ui/NativeText';
import AppWidget from '#/features/widgets/AppWidget';
import { useSubscriptionGalleryState } from '@dhaaga/react';
import { Image } from 'expo-image';
import { appDimensions } from '#/styles/dimensions';
import SubscriptionGalleryWidget from '#/features/inbox/widgets/SubscriptionGalleryWidget';

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
	RightWidget?: (index: number) => ReactElement;
};

function AppPagerView({
	tabCount,
	renderScene,
	labels,
	props,
	scrollEnabled,
	RightWidget,
}: AppPagerViewProps) {
	const [TabIndex, setTabIndex] = useState(0);
	const ref = useRef<PagerView>(null);
	const { theme } = useAppTheme();

	const params = useLocalSearchParams();
	const _requestId: string = params['requestId'] as string;
	const _pagerIndex: string = params['pagerIndex'] as string;

	useEffect(() => {
		if (!_pagerIndex) return;
		ref.current.setPageWithoutAnimation(Number(_pagerIndex));
	}, [_requestId]);

	function onPagerViewScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setTabIndex(nextIdx);
	}

	function onChipSelected(index: number) {
		if (TabIndex !== index) {
			ref.current.setPageWithoutAnimation(index);
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
				style={[{ flex: 1 }, props]}
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
			{RightWidget ? RightWidget(TabIndex) : <View />}
			<SubscriptionGalleryWidget pagerIndex={TabIndex} chips={mappedActions} />
		</>
	);
}

export { AppPagerView };
