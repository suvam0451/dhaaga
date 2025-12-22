import { View, Dimensions, FlatList, RefreshControl } from 'react-native';
import {
	UserMasonryGalleryCtx,
	UserMasonryGalleryStateAction,
	useUserMasonryGalleryDispatch,
	useUserMasonryGalleryState,
} from '@dhaaga/react';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { useApiGetPostsWithMediaFromAuthor } from '#/features/user-profiles/api';

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	headerHeight: number;
};

function Content({ forwardedRef, userId, onScroll, headerHeight }: Props) {
	const [IsRefreshing, setIsRefreshing] = useState(false);

	const State = useUserMasonryGalleryState();
	const dispatch = useUserMasonryGalleryDispatch();

	const { data, fetchStatus, error, refetch } =
		useApiGetPostsWithMediaFromAuthor(userId, State.appliedMaxId);

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
			console.log(data.maxId);
			dispatch({
				type: UserMasonryGalleryStateAction.APPEND,
				payload: data,
			});
		}
	}, [data, fetchStatus]);

	const WIDTH = (Dimensions.get('window').width - 20) / 2;

	function onEndReached() {
		if (State.items.length > 0 && fetchStatus !== 'fetching')
			dispatch({
				type: UserMasonryGalleryStateAction.REQUEST_LOAD_MORE,
			});
	}

	return (
		<>
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
				removeClippedSubviews={true}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.25}
			/>
			<TimelineLoadingIndicator
				numItems={State.items.length}
				networkFetchStatus={fetchStatus}
			/>
		</>
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
