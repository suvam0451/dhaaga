import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import GuidePageBuilder from '#/ui/GuidePageBuilder';
import { useTranslation } from 'react-i18next';

const NS = { ns: LOCALIZATION_NAMESPACE.GUIDES };
const NS_OBJ = {
	ns: LOCALIZATION_NAMESPACE.GUIDES,
	returnObjects: true,
};

function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);

	const qa: { question: string; answers: string[] }[] = [
		{
			question: t(`myAccount.qPageIntro`),
			answers: t(`myAccount.aPageIntro`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`myAccount.qHowManageAccount`),
			answers: t(`myAccount.aHowManageAccount`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`myAccount.qHowEditAccountDetails`),
			answers: t(
				`myAccount.aHowEditAccountDetails`,
				NS_OBJ,
			) as unknown as string[],
		},
		{
			question: t(`myAccount.qProfileOutOfSync`),
			answers: t(`myAccount.aProfileOutOfSync`, NS_OBJ) as unknown as string[],
		},
	];

	return <GuidePageBuilder questionnaire={qa} label={t('myAccount.label')} />;
}

export default Page;
