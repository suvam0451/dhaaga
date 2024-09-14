import { memo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useGetFollows from '../../../../hooks/api/accounts/useGetFollows';
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

/**
 * A list of followers for the
 * selected user
 */
const SharedStackFollows = memo(() => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { Data, refetch } = useGetFollows(id);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<AppTopNavbar
			title={'Follows'}
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

export default SharedStackFollows;
