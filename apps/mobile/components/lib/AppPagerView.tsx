import { useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { StyleSheet, View } from 'react-native';

type AppPagerViewProps = {
	onPageChangeCallback?: (index: number) => void;
	pageCount: number;
	renderFunction: (index: number) => any;
	Index: number;
	setIndex: (index: number) => void;
};

export function AppPagerView({
	onPageChangeCallback,
	pageCount,
	renderFunction,
	Index,
	setIndex,
}: AppPagerViewProps) {
	const ref = useRef<PagerView>(null);

	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setIndex(nextIdx);
		if (onPageChangeCallback) onPageChangeCallback(nextIdx);
	}

	return (
		<PagerView
			ref={ref}
			scrollEnabled={true}
			style={styles.pagerView}
			initialPage={Index}
			onPageScroll={onPageScroll}
		>
			{Array.from({ length: pageCount }).map((_, index) => (
				<View key={index}>{renderFunction(index)}</View>
			))}
		</PagerView>
	);
}

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
	},
});
