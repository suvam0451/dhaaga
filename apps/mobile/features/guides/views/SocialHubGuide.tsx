import GuideFactory from '../components/GuideFactory';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

function SocialHubGuide() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	const qa: { question: string; answers: string[] }[] = [
		{
			question: t(`hub.qPageIntro`),
			answers: t(`hub.aPageIntro`, {
				returnObjects: true,
			}) as unknown as string[],
		},
		{
			question: t(`hub.qHowToUse`),
			answers: t(`hub.aHowToUse`, {
				returnObjects: true,
			}) as unknown as string[],
		},
		{
			question: t(`hub.qExplainProfiles`),
			answers: t(`hub.aExplainProfiles`, {
				returnObjects: true,
			}) as unknown as string[],
		},
		{
			question: t(`hub.qHowToDeletePins`),
			answers: t(`hub.aHowToDeletePins`, {
				returnObjects: true,
			}) as unknown as string[],
		},
		{
			question: t(`hub.qHowToArrangePins`),
			answers: t(`hub.aHowToArrangePins`, {
				returnObjects: true,
			}) as unknown as string[],
		},
		{
			question: t(`hub.qOneMoreThing`),
			answers: t(`hub.aOneMoreThing`, {
				returnObjects: true,
			}) as unknown as string[],
		},
	];

	return <GuideFactory questionnaire={qa} label={t('hub.label')} />;
}

export default SocialHubGuide;
