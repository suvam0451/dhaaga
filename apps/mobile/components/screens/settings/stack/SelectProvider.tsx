import AppTopNavbar from '../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AddAccountPresenter from '../../../../features/onboarding/presenters/AddAccountPresenter';
import { APP_LANDING_PAGE_TYPE } from '../../../shared/topnavbar/AppTabLandingNavbar';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';

function SelectProviderStack() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.pickPlatform`)}
			translateY={translateY}
		>
			<AddAccountPresenter tab={APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB} />
		</AppTopNavbar>
	);
}

export default SelectProviderStack;
