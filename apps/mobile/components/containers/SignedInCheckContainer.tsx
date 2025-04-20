import { useAppAcct } from '../../hooks/utility/global-state-extractors';
import AddAccountPresenter from '../../features/onboarding/presenters/AddAccountPresenter';
import { APP_LANDING_PAGE_TYPE } from '../shared/topnavbar/AppTabLandingNavbar';

type SignedInCheckContainerProps = {
	children: any;
};

function SignedInCheckContainer() {
	const { acct } = useAppAcct();
}
