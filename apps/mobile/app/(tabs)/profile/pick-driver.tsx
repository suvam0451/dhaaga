import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar from '../../../components/shared/topnavbar/AppTopNavbar';
import { AddAccountLandingFragment } from '../../../components/error-screen/AppNoAccount';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar title={`Pick Platform`} translateY={translateY}>
			<AddAccountLandingFragment containerStyle={{ marginTop: '25%' }} />
		</AppTopNavbar>
	);
}

export default Page;
