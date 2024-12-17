import LandingPageStack from '../../../components/screens/notifications/landing/LandingPageStack';
import WithAppNotifSeenContext from '../../../components/screens/notifications/landing/state/useNotifSeen';

export default function NotificationsLandingPage() {
	return (
		<WithAppNotifSeenContext>
			<LandingPageStack />
		</WithAppNotifSeenContext>
	);
}
