import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import { Fragment } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import { Animated, RefreshControl } from 'react-native';
import StatusItem from '../../../components/common/status/StatusItem';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import { appDimensions } from '../../../styles/dimensions';
import type { PostObjectType } from '@dhaaga/bridge';

type PostTimelineProps = {
	data: PostObjectType[];
	refreshing: boolean;
	onRefresh: () => void;
	onScroll: (...args: any[]) => void;
	fetchStatus: FetchStatus;
};

/**
 * This DataView needs to be wrapped
 * with WithPostTimelineCtx
 * @constructor
 */
export function PostTimelinePresenter({
	data,
	refreshing,
	fetchStatus,
	onRefresh,
	onScroll,
}: PostTimelineProps) {
	return (
		<Fragment>
			<Animated.FlatList
				data={data}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<TimelineLoadingIndicator networkFetchStatus={fetchStatus} />
		</Fragment>
	);
}
