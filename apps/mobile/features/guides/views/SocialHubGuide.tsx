import GuideFactory from '../components/GuideFactory';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

const NS_OBJ = {
	ns: LOCALIZATION_NAMESPACE.GUIDES,
	returnObjects: true,
};

function SocialHubGuide() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	const qa: { question: string; answers: string[] }[] = [
		{
			question: t(`hub.qPageIntro`),
			answers: t(`hub.aPageIntro`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`hub.qHowToUse`),
			answers: t(`hub.aHowToUse`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`hub.qExplainProfiles`),
			answers: t(`hub.aExplainProfiles`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`hub.qHowToDeletePins`),
			answers: t(`hub.aHowToDeletePins`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`hub.qHowToArrangePins`),
			answers: t(`hub.aHowToArrangePins`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`hub.qOneMoreThing`),
			answers: t(`hub.aOneMoreThing`, NS_OBJ) as unknown as string[],
		},
	];

	return <GuideFactory questionnaire={qa} label={t('hub.label')} />;
}

export default SocialHubGuide;
