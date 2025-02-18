import { View } from 'react-native';
import { NotificationPostPeek } from '../../../components/screens/notifications/landing/fragments/NotificationPostPeek';
import {
	Props,
	styles,
} from '../../../components/screens/notifications/landing/segments/_common';
import { AppText } from '../../../components/lib/Text';
import { AppDivider } from '../../../components/lib/Divider';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { AppIcon } from '../../../components/lib/Icon';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../styles/dimensions';

function GroupedPostInteractionPresenter({ item }: Props) {
	const { theme } = useAppTheme();
	return (
		<View>
			<GroupedUsersItemView
				items={item.users}
				Header={
					<View style={{ paddingHorizontal: 6 }}>
						<AppIcon
							id="heart-outline"
							size={24}
							color="red"
							containerStyle={{ marginTop: 'auto', marginBottom: 'auto' }}
						/>
						<AppIcon
							id="retweet"
							size={24}
							color="green"
							containerStyle={{
								marginTop: 'auto',
								marginBottom: 'auto',
							}}
						/>
					</View>
				}
			/>
			<AppText.Normal
				style={{
					color: theme.primary.a0,
					marginTop: appDimensions.timelines.sectionBottomMargin * 0.5,
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				Your post was liked and shared by {item.users.length} users
			</AppText.Normal>
			<NotificationPostPeek post={item.post?.boostedFrom || item.post} />
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default GroupedPostInteractionPresenter;
