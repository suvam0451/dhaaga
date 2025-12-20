import { useApiGetMentionUpdates } from '#/hooks/api/useNotifications';
import NotificationItemPresenter from '../presenters/NotificationItemPresenter';
import useNotificationStore from '../interactors/useNotificationStore';
import { TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import type { NotificationObjectType } from '@dhaaga/bridge';
import SimpleInboxTimeline from '#/components/timelines/SimpleInboxTimeline';

function Wrapper({ item }: { item: NotificationObjectType }) {
	const { theme } = useAppTheme();
	function renderLeftActions(progress, dragX) {
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: theme.background.a20,
					borderRadius: 8,
					marginLeft: 4,
				}}
			>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'sync-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'chatbox-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'heart'} size={32} />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<Swipeable
			renderLeftActions={renderLeftActions}
			overshootRight={false}
			overshootFriction={8}
		>
			<NotificationItemPresenter item={item} />
		</Swipeable>
	);
}

function MentionInboxPagerView() {
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetMentionUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <Wrapper item={item} />}
			type={'mentions'}
			label={'Mentions'}
		/>
	);
}

export default MentionInboxPagerView;
