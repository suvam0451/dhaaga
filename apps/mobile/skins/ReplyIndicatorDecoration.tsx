import { useAppTheme } from '#/states/global/hooks';
import { View } from 'react-native';
import CandyCaneLine from '#/skins/christmas/decorators/ChristmasCandyCane';
import { useState } from 'react';

function ReplyIndicatorDecoration() {
	const { theme } = useAppTheme();

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<View style={{ position: 'absolute', height: '100%', left: 18 }}>
			<View
				onLayout={onLayout}
				style={{
					flex: 1,
					marginTop: 52,
					marginBottom: 8,
					width: 4,
					overflow: 'hidden',
					borderRadius: 64,
					opacity: 0.67,
				}}
			>
				<CandyCaneLine height={ContainerHeight} />
			</View>
		</View>
	);
	return (
		<View
			style={{
				position: 'absolute',
				height: '100%',
				left: 18,
			}}
		>
			<View
				style={{
					flex: 1,
					marginTop: 52,
					marginBottom: 8,
					width: 1.5,
					backgroundColor: theme.background.a50, // '#323232',
				}}
			/>
		</View>
	);
}

export default ReplyIndicatorDecoration;
