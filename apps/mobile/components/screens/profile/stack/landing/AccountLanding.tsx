import { memo } from 'react';
import { Animated } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from './fragments/ProfileLandingAccountOverview';
import ProfileLandingAccountModules from './fragments/ProfileLandingAccountModules';

const AccountLanding = memo(() => {
	const { translateY, onScroll } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={'Profile & Settings'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC}
		>
			<Animated.ScrollView
				onScroll={onScroll}
				style={{ paddingHorizontal: 0 }}
				contentContainerStyle={{ marginTop: 54 }}
			>
				<ProfileLandingAccountOverview />
				<ProfileLandingAccountModules />
			</Animated.ScrollView>
		</AppTopNavbar>
	);
});

export default AccountLanding;
