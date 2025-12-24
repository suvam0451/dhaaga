import {
	View,
	Dimensions,
	FlatList,
	RefreshControl,
	Pressable,
} from 'react-native';
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
import { useImageInspect } from '#/states/global/hooks';
import type { PostObjectType } from '@dhaaga/bridge';

type HalfListRendererProps = {
	items: any;
};

function HalfListRenderer({ items }: HalfListRendererProps) {
	const { showInspector, appSession } = useImageInspect();
	const WIDTH = (Dimensions.get('window').width - 20) / 2;

	function onPressMedia(item: PostObjectType) {
		appSession.appManager.storage.setPostForMediaInspect(item);
		showInspector(true);
	}

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => {
							onPressMedia(item.post);
						}}
					>
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
					</Pressable>
				)}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
			/>
		</View>
	);
}

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	headerHeight: number;
};

function Generator({ forwardedRef, userId, onScroll, headerHeight }: Props) {
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
						<HalfListRenderer items={item.left} />
						<HalfListRenderer items={item.right} />
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
			<Generator
				forwardedRef={forwardedRef}
				userId={userId}
				onScroll={onScroll}
				headerHeight={headerHeight}
			/>
		</UserMasonryGalleryCtx>
	);
}

export default UserArtGallery;
