import { View, Text, TouchableOpacity } from 'react-native';
import WithAppPaginationContext from '../../../../states/usePagination';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
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
import { ActivitypubHelper } from '@dhaaga/bridge';
import useGetFollowers from '../../../../hooks/api/accounts/useGetFollowers';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

export function UserItem() {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
	const subdomain = acct?.server;
	const { user } = useActivitypubUserContext();
	const { toProfile } = useAppNavigator();

	const { content } = useMfm({
		content: user.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(subdomain),
		emojiMap: user?.getEmojiMap(),
		deps: [user.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		emphasis: 'high',
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
				marginVertical: 4,
				padding: 2,
				borderRadius: 8,
				marginHorizontal: 4,
				borderBottomWidth: 2,
				borderColor: '#181818',
			}}
			onPress={() => {
				toProfile(user.getId());
			}}
		>
			<View
				style={{
					borderWidth: 2,
					borderColor: 'rgb(100,100,100)',
					borderRadius: 48 / 2,
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
						borderRadius: 44 / 2,
					}}
				/>
			</View>
			<View style={{ marginLeft: 8 }}>
				{content}
				<Text
					style={{
						color: APP_FONT.MEDIUM_EMPHASIS,
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
	const { me } = useGlobalState(
		useShallow((o) => ({
			me: o.me,
		})),
	);
	const { Data, loadNext } = useGetFollowers(me?.getId());
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: Data.length,
		updateQueryCache: loadNext,
	});

	return (
		<WithAutoHideTopNavBar title={'My Followers'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={48}
				contentContainerStyle={{ paddingTop: 54 }}
				onScroll={onScroll}
				data={Data}
				renderItem={(o) => (
					<WithActivitypubUserContext user={o.item}>
						<UserItem />
					</WithActivitypubUserContext>
				)}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyFollowers() {
	return (
		<WithAppPaginationContext>
			<WithScrollOnRevealContext>
				<WithApi />
			</WithScrollOnRevealContext>
		</WithAppPaginationContext>
	);
}

export default MyFollowers;
