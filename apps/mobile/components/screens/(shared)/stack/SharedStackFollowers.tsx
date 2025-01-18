import { useLocalSearchParams } from 'expo-router';
import useGetFollowers from '../../../../features/user-profiles/api/useGetFollowers';
import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithActivitypubUserContext from '../../../../states/useProfile';
import { UserItem } from '../../profile/stack/MyFollowers';

const SharedStackFollowers = memo(() => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data } = useGetFollowers(id);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<AppTopNavbar
			title={'Followers'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<AnimatedFlashList
				estimatedItemSize={48}
				contentContainerStyle={{ paddingTop: 54 }}
				onScroll={onScroll}
				data={data}
				renderItem={({ item }) => (
					<WithActivitypubUserContext userI={item}>
						<UserItem />
					</WithActivitypubUserContext>
				)}
			/>
		</AppTopNavbar>
	);
});

export default SharedStackFollowers;
