import useTopbarSmoothTranslate from './useTopbarSmoothTranslate';
import NavigationService from '../services/navigation.service';

type Props = {
	itemCount?: number;
	updateQueryCache?: () => void;
};

/**
 * A more convenient hook, wrapping
 * other utility hooks in it
 */
function useScrollMoreOnPageEnd(
	{ itemCount = 1, updateQueryCache = () => {} }: Props = {
		itemCount: 1,
		updateQueryCache: () => {},
	},
) {
	function onPageEndReached() {
		if (itemCount > 0) {
			updateQueryCache();
		}
	}

	const handleScrollJs = (e: any) => {
		NavigationService.invokeWhenPageEndReached(e, onPageEndReached);
	};

	const { onScroll, translateY, resetPosition } = useTopbarSmoothTranslate({
		onScrollJsFn: handleScrollJs,
		totalHeight: 100,
		hiddenHeight: 50,
	});

	return { onScroll, translateY, resetPosition };
}

export default useScrollMoreOnPageEnd;
