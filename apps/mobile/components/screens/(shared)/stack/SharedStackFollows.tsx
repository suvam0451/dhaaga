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
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { UserItem } from '../../profile/stack/MyFollowers';
import { APP_FONTS } from '../../../../styles/AppFonts';

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
	const { Data, loadNext } = useGetFollows(id);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: loadNext,
	});

	return (
		<AppTopNavbar
			title={'Follows'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<AnimatedFlashList
				estimatedItemSize={100}
				renderItem={({ item }) => (
					<WithActivitypubUserContext userI={item}>
						<UserItem />
					</WithActivitypubUserContext>
				)}
				data={Data}
				onScroll={onScroll}
				contentContainerStyle={{ paddingTop: 54 }}
				ListHeaderComponent={
					<View>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								textAlign: 'center',
								paddingVertical: 16,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							}}
						>
							This user is following these accounts
						</Text>
					</View>
				}
				ListFooterComponent={
					<View
						style={{ marginVertical: 16, flexShrink: 1, alignItems: 'center' }}
					>
						<TouchableOpacity onPress={loadNext}>
							<View
								style={{
									backgroundColor: '#242424',
									paddingVertical: 8,
									flexShrink: 1,
									maxWidth: 128,
								}}
							>
								<Text
									style={{
										color: APP_FONT.MONTSERRAT_BODY,
										textAlign: 'center',
									}}
								>
									Load More
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				}
			/>
		</AppTopNavbar>
	);
});

export default SharedStackFollows;
