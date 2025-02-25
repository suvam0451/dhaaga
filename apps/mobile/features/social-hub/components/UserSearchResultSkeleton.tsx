import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { FlatList, View } from 'react-native';

type SkeletonProps = {
	totalHeight: number;
};

/**
 * Height: 62
 * @constructor
 */
function Singlet() {
	const handleLayout = (event) => {
		const { height } = event.nativeEvent.layout;
		// console.log(height);
	};

	return (
		<View
			style={{
				paddingHorizontal: 12,
				paddingVertical: 10,
				paddingRight: 12,
				flexDirection: 'row',
				alignItems: 'center',
			}}
			onLayout={handleLayout}
		>
			<Skeleton radius={'round'} height={42} width={42} />
			<View style={{ flex: 1, paddingHorizontal: 8 }}>
				<Skeleton height={32} width={'100%'} colorMode={'dark'} />
			</View>
			<Skeleton radius={'round'} height={32} width={32} />
		</View>
	);
}

export function UserSearchResultSkeletonView({ totalHeight }: SkeletonProps) {
	const numItems = Math.max(1, Math.ceil(totalHeight / 62));
	const arr = new Array(numItems).fill(null);
	return (
		<MotiView>
			<FlatList data={arr} renderItem={Singlet} />{' '}
		</MotiView>
	);
}
