import { View, Text, TouchableOpacity } from 'react-native';
import WithAppPaginationContext from '../../../../states/usePagination';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../../states/useProfile';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AnimatedFlashList } from '@shopify/flash-list';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useMfm from '../../../hooks/useMfm';
import useAppNavigator from '../../../../states/useAppNavigator';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import useGetFollowers from '../../../../hooks/api/accounts/useGetFollowers';

export function UserItem() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const { user } = useActivitypubUserContext();
	const { toProfile } = useAppNavigator();

	const { content } = useMfm({
		content: user.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(subdomain),
		emojiMap: user?.getEmojiMap(),
		deps: [user.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	const handle = ActivitypubHelper.getHandle(
		user?.getAccountUrl(subdomain),
		subdomain,
	);
	return (
		<TouchableOpacity
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: '#161616',
				marginVertical: 4,
				padding: 2,
				borderRadius: 8,
				marginHorizontal: 4,
			}}
			onPress={() => {
				toProfile(user.getId());
			}}
		>
			<View
				style={{
					borderWidth: 2,
					borderColor: 'rgb(100,100,100)',
					borderRadius: 8,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={user.getAvatarUrl()}
					contentFit="fill"
					transition={1000}
					alt={'user avatar'}
					style={{
						width: 44,
						height: 44,
						borderRadius: 4,
					}}
				/>
			</View>
			<View style={{ marginLeft: 8 }}>
				{content}
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						fontSize: 13,
					}}
				>
					{handle}
				</Text>
				<View
					style={{
						opacity: 0.6,
						marginTop: 4,
						flexDirection: 'row',
					}}
				>
					{user.getIsBot() && (
						<FontAwesome5
							name="robot"
							size={12}
							style={{
								opacity: 0.6,
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
								marginHorizontal: 4,
							}}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}

function WithApi() {
	const { me } = useActivityPubRestClientContext();
	const { Data, loadNext } = useGetFollowers(me?.getId());
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: Data.length,
		updateQueryCache: loadNext,
	});

	return (
		<WithAutoHideTopNavBar title={'My Followers'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={48}
				data={Data}
				contentContainerStyle={{ paddingTop: 54 }}
				renderItem={(o) => (
					<WithActivitypubUserContext user={o.item}>
						<UserItem />
					</WithActivitypubUserContext>
				)}
				onScroll={onScroll}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyFollowers() {
	return (
		<WithAppPaginationContext>
			<WithScrollOnRevealContext>
				<View style={{ backgroundColor: '#121212' }}>
					<WithApi />
				</View>
			</WithScrollOnRevealContext>
		</WithAppPaginationContext>
	);
}

export default MyFollowers;
