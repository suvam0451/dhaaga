import { View, Dimensions, FlatList, RefreshControl } from 'react-native';
import {
	userGalleryQueryOpts,
	UserMasonryGalleryCtx,
	UserMasonryGalleryStateAction,
	useUserMasonryGalleryDispatch,
	useUserMasonryGalleryState,
} from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	headerHeight: number;
};

function Content({ forwardedRef, userId, onScroll, headerHeight }: Props) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { client } = useAppApiClient();
	const { data, fetchStatus, error, refetch } = useQuery(
		userGalleryQueryOpts(client, userId),
	);

	const State = useUserMasonryGalleryState();
	const dispatch = useUserMasonryGalleryDispatch();

	useEffect(() => {
		dispatch({ type: UserMasonryGalleryStateAction.INIT });
	}, []);

	function onRefresh() {
		setIsRefreshing(true);
		dispatch({
			type: UserMasonryGalleryStateAction.INIT,
		});
		refetch().finally(() => setIsRefreshing(false));
	}

	useEffect(() => {
		if (fetchStatus !== 'fetching' && !error) {
			dispatch({
				type: UserMasonryGalleryStateAction.APPEND,
				payload: data,
			});
		}
	}, [data, fetchStatus]);

	const WIDTH = (Dimensions.get('window').width - 20) / 2;

	// console.log(Object.keys(data.data));
	return (
		<Animated.FlatList
			ref={forwardedRef}
			data={State.items}
			onScroll={onScroll}
			renderItem={({ item }) => (
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<FlatList
							data={item.left}
							renderItem={({ item }) => (
								<Image
									source={{
										uri: item.media.url,
									}}
									style={{
										width: WIDTH,
										height: item.media.height * (WIDTH / item.media.width),
										borderRadius: 8,
									}}
								/>
							)}
							ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
						/>
					</View>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<FlatList
							data={item.right}
							renderItem={({ item }) => (
								<Image
									source={{
										uri: item.media.url,
									}}
									style={{
										width: WIDTH,
										height: item.media.height * (WIDTH / item.media.width),
										borderRadius: 8,
									}}
								/>
							)}
							ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
						/>
					</View>
				</View>
			)}
			ListHeaderComponent={<View style={{ height: headerHeight }} />}
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			contentContainerStyle={{ paddingTop: 16 }}
			style={[{ flex: 1 }]}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
			}
		/>
	);
}

function UserArtGallery({
	forwardedRef,
	userId,
	onScroll,
	headerHeight,
}: Props) {
	return (
		<UserMasonryGalleryCtx>
			<Content
				forwardedRef={forwardedRef}
				userId={userId}
				onScroll={onScroll}
				headerHeight={headerHeight}
			/>
		</UserMasonryGalleryCtx>
	);
}

export default UserArtGallery;
