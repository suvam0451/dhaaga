import { FlatList, View } from 'react-native';
import { Skeleton } from '#/ui/Skeleton';

/**
 * Current height: 136px
 * With Extra padding: 148px
 */
function Node() {
	function onLayout(event: any) {
		console.log(event.nativeEvent.layout.height);
	}
	return (
		<View
			style={{ paddingHorizontal: 10, marginBottom: 16 }}
			onLayout={onLayout}
		>
			<View style={{ flexDirection: 'row', marginVertical: 10 }}>
				<Skeleton height={40} width={40} style={{ borderRadius: '100%' }} />
				<Skeleton
					height={40}
					width={'auto'}
					style={{ marginLeft: 8, flex: 1 }}
				/>
			</View>
			<Skeleton
				height={20}
				width={'auto'}
				style={{ flex: 1, marginBottom: 8 }}
			/>
			<Skeleton
				height={20}
				width={'auto'}
				style={{ flex: 1, marginBottom: 8 }}
			/>
			<Skeleton height={20} width={'auto'} style={{ width: '75%' }} />
		</View>
	);
}

function InboxTimelineSkeleton({
	containerHeight,
}: {
	containerHeight: number;
}) {
	const NUM_NODES = containerHeight
		? Math.floor((containerHeight - 64) / 136)
		: 0;

	if (NUM_NODES === 0) return <View style={{ height: '100%' }} />;

	return (
		<FlatList data={Array(NUM_NODES).fill(null)} renderItem={() => <Node />} />
	);
}

export default InboxTimelineSkeleton;
