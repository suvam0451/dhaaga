import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar from '../../../components/shared/topnavbar/AppTopNavbar';
import { AddAccountLandingFragment } from '../../../features/onboarding/presenters/AddAccountPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.pickPlatform`)}
			translateY={translateY}
		>
			<AddAccountLandingFragment containerStyle={{ marginTop: '25%' }} />
		</AppTopNavbar>
	);
}

export default Page;
