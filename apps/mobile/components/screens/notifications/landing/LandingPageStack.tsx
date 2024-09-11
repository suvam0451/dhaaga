import { View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useEffect } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import useApiGetNotifications from '../../../../hooks/api/notifications/useApiGetNotifications';
import { useAppNotifSeenContext } from './state/useNotifSeen';
import MarkAllAsRead from './fragments/MarkAllAsRead';
import FlatListRenderer from './fragments/FlatListRenderer';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';

function LandingPageStack() {
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});
	const { appendNotifs } = useAppNotifSeenContext();
	const { Results, refetch } = useApiGetNotifications();

	useEffect(() => {
		appendNotifs(Results.map((o) => o.props.id));
	}, [Results]);

	useEffect(() => {
		const intervalFunction = () => {
			refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC}
			title={'Chat & Notifications'}
			translateY={translateY}
		>
			<AnimatedFlashList
				onScroll={onScroll}
				estimatedItemSize={45}
				contentContainerStyle={{
					paddingTop: 54,
					paddingHorizontal: 8,
					paddingBottom: 54,
				}}
				ListHeaderComponent={
					<View style={{ marginBottom: 16 }}>
						<View
							style={{
								justifyContent: 'flex-end',
								marginVertical: 8,
							}}
						>
							<MarkAllAsRead />
						</View>
						{/*<NotificationControlSegment />*/}
					</View>
				}
				data={Results}
				renderItem={FlatListRenderer}
				getItemType={(o) => o.type}
			/>
		</AppTopNavbar>
	);
}

export default LandingPageStack;
