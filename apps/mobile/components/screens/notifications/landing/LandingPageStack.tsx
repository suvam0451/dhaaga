import { View, StyleSheet, ScrollView } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useEffect } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import PagerView from 'react-native-pager-view';
import NotificationViewSocial from './views/NotificationViewSocial';
import NotificationViewChat from './views/NotificationViewChat';
import NotificationViewUpdates from './views/NotificationViewUpdates';

function LandingPageStack() {
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	useEffect(() => {
		const intervalFunction = () => {
			// refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.NOTIFICATION_CENTER}
			title={'N/A'}
			translateY={translateY}
		>
			<ScrollView
				onScroll={onScroll}
				contentContainerStyle={{ paddingTop: 54, height: '100%' }}
			>
				{/*@ts-ignore-next-line*/}
				<PagerView style={styles.pagerView} initialPage={0}>
					<View key="1">
						<NotificationViewSocial />
					</View>
					<View key="2">
						<NotificationViewChat />
					</View>
					<View key="3">
						<NotificationViewUpdates />
					</View>
				</PagerView>
			</ScrollView>
		</AppTopNavbar>
	);
}

const styles = StyleSheet.create({
	pagerView: {
		paddingTop: 54,
		height: '100%',
		flex: 1,
	},
});

export default LandingPageStack;
