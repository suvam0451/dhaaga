import { memo } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { FlashListType_Post } from '../../../services/flashlist.service';
import FlashListPostRenderer from '../../common/timeline/fragments/FlashListPostRenderer';

const ESTIMATED_POST_HEIGHT = 200;
const SCROLL_EVENT_THROTTLE = 16;
const DEFAULT_TOP_PADDING = 54;

type FlashListPostsProps = {
	data: FlashListType_Post[];
	onScroll?: (...args: any[]) => void;
	ListHeaderComponent?: React.JSX.Element;
	paddingTop?: number;
};

/**
 * Used to render a list of
 * Posts
 */
const FlashListPosts = memo(
	({
		ListHeaderComponent,
		onScroll,
		data,
		paddingTop,
	}: FlashListPostsProps) => {
		return (
			<AnimatedFlashList
				ListHeaderComponent={ListHeaderComponent}
				contentContainerStyle={{
					paddingTop:
						paddingTop === undefined ? DEFAULT_TOP_PADDING : paddingTop,
				}}
				estimatedItemSize={ESTIMATED_POST_HEIGHT}
				data={data}
				renderItem={FlashListPostRenderer}
				scrollEventThrottle={SCROLL_EVENT_THROTTLE}
				getItemType={(o) => o.type}
				onScroll={onScroll}
			/>
		);
	},
);

export default FlashListPosts;
