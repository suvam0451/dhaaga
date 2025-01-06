import { View } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Collections'}
			translateY={translateY}
		>
			<View></View>
		</AppTopNavbar>
	);
}

export default Page;
