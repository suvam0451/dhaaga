import { View } from 'react-native';
import { Skeleton } from '#/ui/Skeleton';
import { memo } from 'react';

/**
 * Height: 140
 * @constructor
 */
const Node = memo(() => {
	return (
		<View style={{ paddingHorizontal: 10 }}>
			<View style={{ flexDirection: 'row', marginVertical: 10 }}>
				<Skeleton height={40} width={40} style={{ borderRadius: '100%' }} />
				<Skeleton
					height={40}
					width={'auto'}
					style={{ marginLeft: 8, flex: 1 }}
				/>
			</View>
			<Skeleton height={72} width={'auto'} style={{ marginBottom: 8 }} />
		</View>
	);
});

type Props = {
	containerHeight: number;
};

function MentionItemSkeleton({ containerHeight }: Props) {
	const NUM_NODES = containerHeight ? Math.floor(containerHeight / 140) : 0;

	if (NUM_NODES === 0) return <View style={{ height: '100%' }} />;

	return (
		<>
			{Array(NUM_NODES)
				.fill(null)
				.map((_, i) => (
					<Node key={i} />
				))}
		</>
	);
}

export default MentionItemSkeleton;
