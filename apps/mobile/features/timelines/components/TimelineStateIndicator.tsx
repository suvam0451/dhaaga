import { View, StyleSheet } from 'react-native';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { useMemo } from 'react';
import PostSkeleton from '#/ui/skeletons/PostSkeleton';

type TimelineErrorViewProps = {
	error: any;
};

function TimelineErrorView({ error }: TimelineErrorViewProps) {
	return (
		<View style={styles.root}>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load Timeline'}
				errorDescription={error?.toString()}
			/>
		</View>
	);
}

function TimelineEmptyView() {
	return (
		<View style={styles.root}>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Timeline Empty'}
				errorDescription={'No results were found.'}
			/>
		</View>
	);
}

export type TimelineRenderItemType =
	| 'post'
	| 'user-any' // auto-routed based on the driver
	| 'user-detailed'
	| 'user-partial'
	| 'mention'
	| 'chat-room'
	| 'message'
	| 'social-update'
	| 'feed'
	| 'post-thread';

type Props = {
	itemType: TimelineRenderItemType;
	containerHeight: number;
	queryResult: { isRefetching: boolean; error: Error; isFetched: boolean };
	numItems: number;
};

/**
 * Handles loading/error states for a timeline
 * FlatList and shows skeleton placeholder nodes
 *
 * @param queryResult
 * @param numItems
 * @param containerHeight
 * @param itemType
 * @constructor
 */
function TimelineStateIndicator({
	queryResult,
	numItems,
	containerHeight,
	itemType,
}: Props) {
	const Skeleton = useMemo(() => {
		switch (itemType) {
			case 'post':
				return <PostSkeleton containerHeight={containerHeight} />;
			default:
				return <PostSkeleton containerHeight={containerHeight} />;
		}
	}, [itemType, containerHeight]);

	const { isFetched, error, isRefetching } = queryResult;
	if (numItems === 0 && (isRefetching || !isFetched)) return Skeleton;
	if (error) return <TimelineErrorView error={error} />;
	if (numItems === 0) return <TimelineEmptyView />;
	return <View />;
}

export default TimelineStateIndicator;

const styles = StyleSheet.create({
	root: {
		paddingTop: 52,
		margin: 'auto',
		borderRadius: 12,
		alignItems: 'center',
	},
});
