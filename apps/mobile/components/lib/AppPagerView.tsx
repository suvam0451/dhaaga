import { useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { StyleSheet, View } from 'react-native';

type AppPagerViewProps = {
	onPageChangeCallback?: (index: number) => void;
	pageCount: number;
	renderFunction: (index: number) => any;
};

export function AppPagerView({
	onPageChangeCallback,
	pageCount,
	renderFunction,
}: AppPagerViewProps) {
	const ref = useRef<PagerView>(null);
	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		if (onPageChangeCallback) onPageChangeCallback(nextIdx);
	}

	return (
		<PagerView
			ref={ref}
			scrollEnabled={true}
			style={styles.pagerView}
			initialPage={0}
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
