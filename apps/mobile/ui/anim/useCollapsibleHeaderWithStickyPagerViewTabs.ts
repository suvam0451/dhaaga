import { useRef, useState } from 'react';
import {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
} from 'react-native-reanimated';

function useCollapsibleHeaderWithStickyPagerViewTabs(fixedPageCount: number) {
	/**
	 * state
	 */

	const [TabIndex, setTabIndex] = useState(0);
	const [HeaderAreaHeight, setHeaderAreaHeight] = useState(0);

	/**
	 * refs
	 */

	const pagerRef = useRef(null);
	const listsRef = useRef<any>(
		Array.from({ length: fixedPageCount }).map(() => null),
	);

	/**
	 * shared values (animation)
	 */

	const scrollOffsets = useSharedValue(
		Array.from({ length: fixedPageCount }).map(() => 0),
	);
	const scrollY = useSharedValue(0);
	const headerHeight = useSharedValue(0);
	const MAX_HEADER_SCROLL = useDerivedValue(() =>
		Math.max(headerHeight.value, 0),
	);
	const clampedScrollY = useDerivedValue(() =>
		Math.min(scrollY.value, MAX_HEADER_SCROLL.value),
	);

	/**
	 * animated styles
	 */

	const headerStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -clampedScrollY.value }],
	}));

	const tabBarStyle = useAnimatedStyle(() => ({
		top: headerHeight.value,
		transform: [{ translateY: -clampedScrollY.value }],
	}));

	/**
	 * Functions
	 */

	/**
	 * scroll handler intended for flat
	 * lists within each page
	 */
	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollY.value = e.contentOffset.y;
			// update current tab's scroll offset
			// scrollOffsets.value[TabIndex] = e.contentOffset.y;
		},
		onMomentumEnd: (e) => {
			scrollOffsets.value[TabIndex] = e.contentOffset.y;
		},
	});

	function onLayout(e: any) {
		headerHeight.value = e.nativeEvent.layout.height;
		setHeaderAreaHeight(e.nativeEvent.layout.height);
	}

	// switch tabs programmatically
	function switchToTab(index: number) {
		// restore scroll offset for that tab
		const list = listsRef.current[index];
		if (!list) return;

		if (scrollY.value < headerHeight.value) {
			list.scrollToOffset({
				offset: scrollY.value,
				animated: false,
			});
		} else {
			scrollY.value = Math.max(headerHeight.value, scrollOffsets.value[index]);
			list.scrollToOffset({
				offset: Math.max(headerHeight.value, scrollOffsets.value[index]),
				animated: false,
			});
		}

		setTabIndex(index);
		pagerRef.current?.setPage(index);
	}

	return {
		tabIndex: TabIndex,
		onLayout,
		onScroll,
		switchToTab,
		headerStyle,
		tabBarStyle,
		headerHeight: HeaderAreaHeight,
		pagerRef,
		listsRef,
	};
}

export default useCollapsibleHeaderWithStickyPagerViewTabs;
