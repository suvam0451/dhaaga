import { FlatList, View } from 'react-native';
import { Skeleton } from '../../../ui/Skeleton';
import { ReactElement, useState } from 'react';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../styles/dimensions';

// height : 136

function NotificationSkeletonView() {
	function onLayout(event: any) {
		console.log(event.nativeEvent.layout);
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
			{/*<View style={{ flexDirection: 'row', height: 200, marginBottom: 8 }}>*/}
			{/*	<View style={{ flex: 2, paddingRight: 8 }}>*/}
			{/*		<Skeleton height={'auto'} width={'auto'} />*/}
			{/*	</View>*/}
			{/*	<View style={{ flex: 2, paddingRight: 8 }}>*/}
			{/*		<Skeleton height={'auto'} width={'auto'} />*/}
			{/*	</View>*/}
			{/*	<Skeleton height={'auto'} width={120} style={{ flex: 1 }} />*/}
			{/*</View>*/}
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

type Props = {
	Header?: ReactElement;
};

function NotificationSkeletonPresenter({ Header }: Props) {
	const { theme } = useAppTheme();
	const [NumNodes, setNumNodes] = useState(0);

	function onLayout(event: any) {
		setNumNodes(Math.floor(event.nativeEvent.layout.height / 136));
	}

	if (NumNodes === 0)
		return <View style={{ height: '100%' }} onLayout={onLayout} />;

	return (
		<FlatList
			data={Array(NumNodes).fill(null)}
			renderItem={() => <NotificationSkeletonView />}
			ListHeaderComponent={Header}
		/>
	);
}

export { NotificationSkeletonView, NotificationSkeletonPresenter };
