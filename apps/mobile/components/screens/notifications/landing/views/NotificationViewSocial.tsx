import { memo } from 'react';
import useApiGetSocialNotifs from '../api/useApiGetSocialNotifs';
import { FlatList, View } from 'react-native';
import FlatListRenderer from '../fragments/FlatListRenderer';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';

const NotificationViewSocial = memo(() => {
	const { items: SocialNotifs } = useApiGetSocialNotifs();

	return (
		<FlatList
			data={SocialNotifs}
			renderItem={({ item }) => {
				return <FlatListRenderer item={item} />;
			}}
			ListHeaderComponent={
				<View>
					<AppTabLandingNavbar
						type={APP_LANDING_PAGE_TYPE.INBOX}
						menuItems={[
							{
								iconId: 'cog',
							},
							{
								iconId: 'user-guide',
							},
						]}
					/>
					{/*<Text*/}
					{/*	style={{*/}
					{/*		color: APP_FONT.MONTSERRAT_BODY,*/}
					{/*		fontSize: 14,*/}
					{/*		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,*/}
					{/*		textAlign: 'center',*/}
					{/*	}}*/}
					{/*>*/}
					{/*	These users have liked, shared or mentioned you in a post.{' '}*/}
					{/*</Text>*/}
				</View>
			}
		/>
	);
});

export default NotificationViewSocial;
