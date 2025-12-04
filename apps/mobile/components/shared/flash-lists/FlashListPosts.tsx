import { memo } from 'react';
import { FlashListType_Post } from '../../../services/flashlist.service';
import { Animated } from 'react-native';
import WithAppStatusItemContext from '../../containers/contexts/WithPostItemContext';
import StatusItem from '../../common/status/StatusItem';

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
			<Animated.FlatList
				ListHeaderComponent={ListHeaderComponent}
				contentContainerStyle={{
					paddingTop:
						paddingTop === undefined ? DEFAULT_TOP_PADDING : paddingTop,
				}}
				data={data}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item.props.dto}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				scrollEventThrottle={SCROLL_EVENT_THROTTLE}
				onScroll={onScroll}
			/>
		);
	},
);

export default FlashListPosts;
