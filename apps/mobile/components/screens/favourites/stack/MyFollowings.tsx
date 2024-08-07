import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import TitleOnlyStackHeaderContainer from '../../../containers/TitleOnlyStackHeaderContainer';
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../../states/useScrollOnReveal';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../../states/useProfile';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import UserActionSheet from '../../../bottom-sheets/User';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

function UserItem() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const { user } = useActivitypubUserContext();
	const [BottomSheetVisible, setBottomSheetVisible] = useState(false);

	return (
		<View>
			<TouchableOpacity
				onPress={() => {
					setBottomSheetVisible(true);
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: '#161616',
						marginVertical: 4,
						padding: 8,
						borderRadius: 8,
					}}
				>
					<View
						style={{
							borderWidth: 2,
							borderColor: 'rgb(100,100,100)',
							borderRadius: 8,
							opacity: 0.87,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={user.getAvatarUrl()}
							contentFit="fill"
							transition={1000}
							alt={'user avatar'}
							style={{
								width: 48,
								height: 48,
								borderRadius: 4,
							}}
						/>
					</View>
					<View style={{ marginLeft: 8 }}>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_HEADER,
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							}}
							numberOfLines={1}
						>
							{user.getDisplayName()}
						</Text>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 13,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							}}
							numberOfLines={1}
						>
							{user.getAppDisplayAccountUrl(subdomain)}
						</Text>
						<View
							style={{
								opacity: 0.6,
								marginTop: 4,
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							{user.getIsBot() && (
								<FontAwesome5
									name="robot"
									size={12}
									style={{
										marginHorizontal: 4,
									}}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							)}
							{user.getIsLockedProfile() && (
								<FontAwesome5
									name="user-lock"
									size={12}
									style={{
										opacity: 0.6,
										marginHorizontal: 4,
									}}
									color="#fff"
								/>
							)}
						</View>
					</View>
				</View>
			</TouchableOpacity>
			<UserActionSheet visible={false} setVisible={setBottomSheetVisible} />
		</View>
	);
}

function WithItemList() {
	const { data } = useAppPaginationContext();
	const ref = useRef(null);

	return (
		<AnimatedFlashList
			estimatedItemSize={100}
			data={data}
			ref={ref}
			renderItem={(o) => (
				<WithActivitypubUserContext user={o.item} key={o.index}>
					<UserItem />
				</WithActivitypubUserContext>
			)}
		/>
	);
}

function WithApi() {
	const { client, me } = useActivityPubRestClientContext();
	const userId = me.getId();

	const navigation = useNavigation();
	const route = useRoute<any>();
	const {
		data: PageData,
		updateQueryCache,
		queryCacheMaxId,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return await client.getFollowing(me.getId());
	}

	// Queries
	const { data, status, fetchStatus, refetch } = useQuery({
		queryKey: ['following', userId, queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data, (o) => o.id);
			setMaxId((PageData.length + data.length).toString());
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	function onScrollEndReach() {
		if (PageData.length > 0) {
			updateQueryCache();
			refetch();
		}
	}

	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Your Followings`}
			onScrollViewEndReachedCallback={onScrollEndReach}
		>
			<View style={{ height: 200 }}></View>
			<Text
				style={{
					textAlign: 'center',
					marginVertical: 16,
					fontSize: 20,
					fontWeight: 700,
					color: APP_FONT.MONTSERRAT_HEADER,
				}}
			>
				All / People / Bots / Mutuals
			</Text>
			<WithItemList />
		</TitleOnlyStackHeaderContainer>
	);
}

function WithContextWrappers() {
	return (
		<WithAppPaginationContext>
			<WithScrollOnRevealContext>
				<WithApi />
			</WithScrollOnRevealContext>
		</WithAppPaginationContext>
	);
}

function MyFollowings() {
	return (
		<View style={{ backgroundColor: '#121212' }}>
			<WithContextWrappers />
		</View>
	);
}

export default MyFollowings;
