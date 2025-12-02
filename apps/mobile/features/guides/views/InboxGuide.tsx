import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { QnAType } from '../types/app-guides.types';
import GuidePageBuilder from '#/ui/GuidePageBuilder';

function InboxGuide() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	const qa: QnAType = [
		{
			question: t(`inbox.qPageIntro`),
			answers: t(`inbox.aPageIntro`, { returnObjects: true }) as string[],
		},
		{
			question: t(`inbox.qTabMention`),
			answers: t(`inbox.aTabMention`, { returnObjects: true }) as string[],
		},
		{
			question: t(`inbox.qTabChat`),
			answers: t(`inbox.aTabChat`, { returnObjects: true }) as string[],
		},
		{
			question: t(`inbox.qTabSocial`),
			answers: t(`inbox.aTabSocial`, { returnObjects: true }) as string[],
		},
		{
			question: t(`inbox.qTabUpdates`),
			answers: t(`inbox.aTabUpdates`, { returnObjects: true }) as string[],
		},
		{
			question: t(`inbox.qWhyFewSettings`),
			answers: t(`inbox.aWhyFewSettings`, { returnObjects: true }) as string[],
		},
	];

	return <GuidePageBuilder questionnaire={qa} label={t('inbox.label')} />;
}

export default InboxGuide;
