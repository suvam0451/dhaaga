import { View, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import { memo } from 'react';

type LoadingMoreProps = {
	visible: boolean;
	loading: boolean;
};

const LoadingMore = memo(({ visible, loading }: LoadingMoreProps) => {
	if (!visible) return <View></View>;
	if (visible && loading)
		return (
			<View
				style={{
					position: 'absolute',
					height: 64,
					width: '100%',
					bottom: 0,
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						position: 'relative',
						display: 'flex',
						flexDirection: 'row',
						backgroundColor: 'rgba(64,64,64,0.75)',
						padding: 8,
						borderRadius: 8,
					}}
				>
					<ActivityIndicator size="small" color="#ffffff87" />
					<Text
						style={{
							color: '#fff',
							opacity: 0.6,
							textAlign: 'center',
							marginLeft: 4,
						}}
					>
						{'Loading More...'}
					</Text>
				</View>
			</View>
		);
	if (loading)
		return (
			<View
				style={{
					marginTop: 24,
					marginBottom: 24,
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					justifyContent: 'center',
				}}
			>
				<Text style={{ color: '#fff', opacity: 0.3 }}>Loading More...</Text>
				<ActivityIndicator />
			</View>
		);
	return <View></View>;
});

export default LoadingMore;
