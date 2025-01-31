import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

type Props = {
	type: APP_LANDING_PAGE_TYPE;
};

function Header({ type }: Props) {
	return (
		<AppTabLandingNavbar
			type={type}
			menuItems={[
				{
					iconId: 'user-guide',
					onPress: () => {
						router.navigate(APP_ROUTING_ENUM.GUIDE_INBOX);
					},
				},
			]}
		/>
	);
}

export default Header;
