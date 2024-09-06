import WithAppPaginationContext from '../../../../states/usePagination';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import { AnimatedFlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { UserItem } from './MyFollowers';
import WithActivitypubUserContext from '../../../../states/useProfile';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import useFollowings from '../api/useFollowings';

function WithApi() {
	const { me } = useActivityPubRestClientContext();
	const { data, updateQueryCache } = useFollowings(me?.getId());
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: data?.length,
		updateQueryCache,
	});

	return (
		<WithAutoHideTopNavBar title={'My Followings'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={48}
				data={data}
				contentContainerStyle={{ paddingTop: 54 }}
				renderItem={(o) => (
					<WithActivitypubUserContext user={o.item} key={o.index}>
						<UserItem />
					</WithActivitypubUserContext>
				)}
				onScroll={onScroll}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyFollowings() {
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

export default MyFollowings;
