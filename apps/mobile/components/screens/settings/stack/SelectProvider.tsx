import AppTopNavbar from '../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AddAccountPresenter from '../../../../features/onboarding/presenters/AddAccountPresenter';
import { APP_LANDING_PAGE_TYPE } from '../../../shared/topnavbar/AppTabLandingNavbar';

function SelectProviderStack() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar title={`Pick Platform`} translateY={translateY}>
			<AddAccountPresenter tab={APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB} />
		</AppTopNavbar>
	);
}

export default SelectProviderStack;
