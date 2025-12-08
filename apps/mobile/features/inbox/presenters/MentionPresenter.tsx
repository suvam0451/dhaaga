import { useApiGetMentionUpdates } from '#/hooks/api/useNotifications';
import NotificationItemPresenter from './NotificationItemPresenter';
import useNotificationStore from '../interactors/useNotificationStore';
import { TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import type { NotificationObjectType } from '@dhaaga/bridge/typings';
import SimpleInboxTimeline from '#/components/timelines/SimpleInboxTimeline';

function Wrapper({ item }: { item: NotificationObjectType }) {
	const { theme } = useAppTheme();

	function renderLeftActions(progress, dragX) {
		// A shared flag so haptically triggers only once
		// const triggered = useSharedValue(false);

		// useAnimatedReaction(
		// 	() => progress.value,
		// 	(value) => {
		// 		const threshold = 0.8; // 30% reveal
		//
		// 		if (value > threshold && !triggered.value) {
		// 			triggered.value = true;
		// 			runOnJS(triggerHaptic)();
		// 		}
		//
		// 		if (value <= threshold && triggered.value) {
		// 			triggered.value = false; // reset so you can trigger again next swipe
		// 		}
		// 	},
		// );

		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
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
			childrenContainerStyle={{ backgroundColor: theme.background.a0 }}
		>
			<NotificationItemPresenter item={item} />
		</Swipeable>
	);
}

function MentionPresenter() {
	const { maxId } = useNotificationStore();
	const queryResult = useApiGetMentionUpdates(maxId);

	return (
		<SimpleInboxTimeline
			queryResult={queryResult}
			Wrapper={({ item }) => <Wrapper item={item} />}
		/>
	);
}

export default MentionPresenter;
