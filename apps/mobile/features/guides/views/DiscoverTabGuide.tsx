import GuideFactory from '../components/GuideFactory';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

function DiscoverTabGuide() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	const qa: { question: string; answers: string[] }[] = [
		{
			question: t(`discover.qPageIntro`),
			answers: t(`discover.aPageIntro`, { returnObjects: true }) as string[],
		},
		{
			question: t(`discover.qStuckCannotReset`),
			answers: t(`discover.aStuckCannotReset`, {
				returnObjects: true,
			}) as string[],
		},
		{
			question: t(`discover.qNoRecommendations`),
			answers: t(`discover.aNoRecommendations`, {
				returnObjects: true,
			}) as string[],
		},
	];

	return <GuideFactory questionnaire={qa} label={t('discover.label')} />;
}

export default DiscoverTabGuide;
