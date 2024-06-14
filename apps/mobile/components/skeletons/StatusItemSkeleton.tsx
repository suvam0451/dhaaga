import { View } from 'react-native';
import { Skeleton } from '@rneui/themed';

function StatusItemSkeleton() {
	return (
		<View>
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				<View style={{ height: 48, width: 48 }}>
					<Skeleton style={{ height: 48 }} circle />
				</View>
				<View style={{ height: 48, flexGrow: 1, marginLeft: 8 }}>
					<Skeleton style={{ height: 48, borderRadius: 8 }} />
				</View>
			</View>
			<View style={{ marginTop: 16 }}>
				<Skeleton style={{ height: 160, borderRadius: 8 }} />
			</View>
			<View style={{ marginTop: 16 }}>
				<Skeleton style={{ height: 48, borderRadius: 8 }} />
			</View>
		</View>
	);
}

export default StatusItemSkeleton;
