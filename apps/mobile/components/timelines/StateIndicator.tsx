import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';

function TimelineEmptyView() {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.palette.bg,
				paddingTop: 52,
			}}
		>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Timeline Empty'}
				errorDescription={'No results were found.\nOr, something went wrong.'}
			/>
		</View>
	);
}

export function TimelineQueryStatusIndicator({
	queryResult,
	renderSkeleton,
	numItems,
}: {
	queryResult: { isRefetching: boolean; error: Error; isFetched: boolean };
	renderSkeleton: () => React.ReactNode;
	numItems: number;
}) {
	const { isFetched, error, isRefetching } = queryResult;
	if (numItems === 0 && (isRefetching || !isFetched)) return renderSkeleton();
	if (error) return <TimelineErrorView error={error} />;
	if (numItems === 0) return <TimelineEmptyView />;
	return <View />;
}
