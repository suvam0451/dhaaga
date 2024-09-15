import { useLocalSearchParams } from 'expo-router';
import useGetFollowers from '../../../../hooks/api/accounts/useGetFollowers';
import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../../states/useProfile';
import { Text, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';

const ListItem = memo(() => {
	const { user } = useActivitypubUserContext();

	return (
		<View>
			<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
				{user.getUsername()}
			</Text>
		</View>
	);
});

const SharedStackFollowers = memo(() => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { Data, refetch } = useGetFollowers(id);

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
				renderItem={({ item }) => (
					<WithActivitypubUserContext userI={item}>
						<ListItem />
					</WithActivitypubUserContext>
				)}
				data={Data}
				onScroll={onScroll}
			/>
		</AppTopNavbar>
	);
});

export default SharedStackFollowers;
