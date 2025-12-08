import { View, Dimensions, FlatList } from 'react-native';
import {
	userGalleryQueryOpts,
	UserMasonryGalleryCtx,
	UserMasonryGalleryStateAction,
	useUserMasonryGalleryDispatch,
	useUserMasonryGalleryState,
} from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';

type Props = {
	userId: string;
	onScroll: any;
	animatedStyle: any;
};

function Content({ userId, onScroll, animatedStyle }: Props) {
	const { client } = useAppApiClient();
	const { data, fetchStatus, error } = useQuery(
		userGalleryQueryOpts(client, userId),
	);

	const State = useUserMasonryGalleryState();
	const dispatch = useUserMasonryGalleryDispatch();

	useEffect(() => {
		dispatch({ type: UserMasonryGalleryStateAction.INIT });
	}, []);

	useEffect(() => {
		if (fetchStatus !== 'fetching' && !error) {
			dispatch({
				type: UserMasonryGalleryStateAction.APPEND,
				payload: data,
			});
		}
	}, [data, fetchStatus]);

	const WIDTH = (Dimensions.get('window').width - 20) / 2;

	return (
		<Animated.FlatList
			data={State.items}
			onScroll={onScroll}
			renderItem={({ item }) => (
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<View style={{ flex: 1 }}>
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
					<View style={{ flex: 1 }}>
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
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			style={[{ flex: 1 }, animatedStyle]}
		/>
	);
}

function UserArtGallery({ userId, onScroll, animatedStyle }: Props) {
	return (
		<UserMasonryGalleryCtx>
			<Content
				userId={userId}
				onScroll={onScroll}
				animatedStyle={animatedStyle}
			/>
		</UserMasonryGalleryCtx>
	);
}

export default UserArtGallery;
