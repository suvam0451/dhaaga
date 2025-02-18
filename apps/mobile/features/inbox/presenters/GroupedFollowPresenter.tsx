import { View } from 'react-native';
import {
	Props,
	styles,
} from '../../../components/screens/notifications/landing/segments/_common';
import { AppText } from '../../../components/lib/Text';
import { AppIcon } from '../../../components/lib/Icon';
import GroupedUsersItemView from '../view/GroupedUsersItemView';
import { AppDivider } from '../../../components/lib/Divider';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

function GroupedFollowPresenter({ item }: Props) {
	const { theme } = useAppTheme();
	return (
		<View>
			<GroupedUsersItemView
				items={item.users}
				Header={
					<View
						style={[styles.groupIndicatorIcon, { backgroundColor: '#34aed2' }]}
					>
						<AppIcon id="add" size={18} color="white" />
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
				You have {item.users.length} new followers
			</AppText.Normal>
			<AppDivider.Soft style={{ marginVertical: 12 }} />
		</View>
	);
}

export default GroupedFollowPresenter;
