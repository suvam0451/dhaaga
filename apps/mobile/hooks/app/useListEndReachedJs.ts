const END_OF_CONTAINER_SCROLL_THRESHOLD = 40;

/**
 * Usable with flash-list
 * @param onEndReached
 * @param itemCount
 */
function useListEndReachedJs(
	onEndReached: () => void = () => {},
	itemCount: number = 0,
) {
	function onScroll(e: any) {
		const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
		if (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - END_OF_CONTAINER_SCROLL_THRESHOLD
		) {
			if (itemCount > 0) onEndReached();
		}
	}
	return { onScroll };
}

export default useListEndReachedJs;
