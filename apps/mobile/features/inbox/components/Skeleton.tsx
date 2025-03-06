import { View } from 'react-native';
import { Skeleton } from '../../../ui/Skeleton';

function NotificationSkeletonView() {
	function onLayout(event: any) {
		console.log(event.nativeEvent.layout);
	}

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
		</View>
	);
}

export { NotificationSkeletonView };
