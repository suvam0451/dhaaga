import WithAppPaginationContext from '../../../../states/usePagination';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import { AnimatedFlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { UserItem } from './MyFollowers';
import WithActivitypubUserContext from '../../../../states/useProfile';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import useGetFollows from '../../../../hooks/api/accounts/useGetFollows';

function WithApi() {
	const { me } = useActivityPubRestClientContext();
	const { Data, loadNext } = useGetFollows(me?.getId());
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: Data?.length,
		updateQueryCache: loadNext,
	});

	return (
		<WithAutoHideTopNavBar title={'My Followings'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={48}
				data={Data}
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
				<WithApi />
			</WithScrollOnRevealContext>
		</WithAppPaginationContext>
	);
}

export default MyFollowings;
