import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import GuideFactory from '#/features/guides/components/GuideFactory';
import { useTranslation } from 'react-i18next';

const NS = { ns: LOCALIZATION_NAMESPACE.GUIDES };
const NS_OBJ = {
	ns: LOCALIZATION_NAMESPACE.GUIDES,
	returnObjects: true,
};
function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	return <GuideFactory questionnaire={[]} label={'Sample Guide'} />;
}

export default Page;
