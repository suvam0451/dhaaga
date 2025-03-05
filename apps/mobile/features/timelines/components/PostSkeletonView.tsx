import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../ui/Skeleton';
import { useState } from 'react';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import TimelinesHeader from '../../../components/shared/topnavbar/fragments/TopNavbarTimelineStack';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { appDimensions } from '../../../styles/dimensions';

/**
 * Height: 308
 * @constructor
 */
function PostSkeletonView() {
	// function onLayout(event: any) {
	// 	console.log(event.nativeEvent.layout);
	// }
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
			<Skeleton height={200} width={'auto'} style={{ marginBottom: 8 }} />
			<View style={{ flexDirection: 'row', marginBottom: 16 }}>
				<Skeleton height={24} width={124} />
				<View style={{ flex: 1 }} />
				<Skeleton height={24} width={64} />
			</View>
		</View>
	);
}

function PostTimelinePlaceholderView() {
	const { theme } = useAppTheme();
	const [NumNodes, setNumNodes] = useState(0);
	const { translateY } = useScrollMoreOnPageEnd();

	function onLayout(event: any) {
		setNumNodes(Math.floor(event.nativeEvent.layout.height / 310));
	}

	console.log(NumNodes);
	if (NumNodes === 0)
		return <View style={{ height: '100%' }} onLayout={onLayout} />;
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader />
			</Animated.View>
			<FlatList
				data={Array(NumNodes).fill(null)}
				renderItem={() => <PostSkeletonView />}
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
			/>
		</View>
	);
}

export { PostSkeletonView, PostTimelinePlaceholderView };

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
	},
});
