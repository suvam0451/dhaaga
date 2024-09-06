import { View, Text } from 'react-native';
import { useRef } from 'react';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
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
import useMyFollowers from '../../apps/api/useMyFollowers';

function UserItem() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const { user } = useActivitypubUserContext();

	return (
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
				<Text style={{ color: APP_FONT.MONTSERRAT_HEADER }}>
					{user.getDisplayName()}
				</Text>
				<Text
					style={{
						color: '#fff',
						opacity: 0.6,
					}}
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
								opacity: 0.6,
								marginHorizontal: 4,
							}}
							color="#fff"
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
	const { data, updateQueryCache } = useMyFollowers();

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: data?.length,
		updateQueryCache,
	});

	return (
		<WithAutoHideTopNavBar title={'Your Followers'} translateY={translateY}>
			<View style={{ height: 200 }}></View>
			<Text
				style={{
					textAlign: 'center',
					marginVertical: 16,
					fontSize: 20,
					fontWeight: 700,
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.INTER_700_BOLD,
				}}
			>
				All / People / Bots / Mutuals
			</Text>
			<WithItemList />
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
