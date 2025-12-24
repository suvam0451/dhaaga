import { Skeleton } from '#/ui/Skeleton';
import { memo } from 'react';
import { View } from 'react-native';

type NodeProps = {
	index: number;
};

/**
 * Height: 52
 * @constructor
 */
const Node = memo(({ index }: NodeProps) => {
	const THIRD = index % 3 === 2;
	if (!THIRD) {
		return (
			<View style={{ paddingHorizontal: 10 }}>
				<View style={{ flexDirection: 'row', marginVertical: 10 }}>
					<Skeleton height={32} width={32} style={{ borderRadius: '100%' }} />
					<Skeleton
						height={32}
						width={'auto'}
						style={{ marginLeft: 8, width: '48%' }}
					/>
				</View>
			</View>
		);
	}
	return (
		<View style={{ paddingHorizontal: 10 }}>
			<View style={{ flexDirection: 'row-reverse', marginVertical: 10 }}>
				<Skeleton
					height={32}
					width={'auto'}
					style={{ marginLeft: 8, width: '64%' }}
				/>
			</View>
		</View>
	);
});

type Props = {
	containerHeight: number;
};

function MessageItemSkeleton({ containerHeight }: Props) {
	const NUM_NODES = containerHeight ? Math.floor(containerHeight / 52) : 0;

	if (NUM_NODES === 0) return <View style={{ height: '100%' }} />;

	return (
		<>
			{Array(NUM_NODES)
				.fill(null)
				.map((_, i) => (
					<Node index={i} key={i} />
				))}
		</>
	);
}

export default MessageItemSkeleton;
