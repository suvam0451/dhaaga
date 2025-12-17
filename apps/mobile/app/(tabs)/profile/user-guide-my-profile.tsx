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
			question: t(`myAccount.qPageIntro`, {
				ns: LOCALIZATION_NAMESPACE.GUIDES,
			}),
			answers: t(`myAccount.aPageIntro`, NS_OBJ) as unknown as string[],
		},
		{
			question: 'How to add/switch accounts?',
			answers: [
				'New accounts can be onboarded from the account management page. Access it from the navbar of your home interface.',
				'Also, long pressing the profile tab (5th) brings up the account switcher :)',
			],
		},
		{
			question: t(`myAccount.qHowEditAccountDetails`, NS),
			answers: t(
				`myAccount.aHowEditAccountDetails`,
				NS_OBJ,
			) as unknown as string[],
		},
		{
			question: t(`myAccount.qProfileOutOfSync`, NS),
			answers: t(`myAccount.aProfileOutOfSync`, NS_OBJ) as unknown as string[],
		},
	];

	return <GuidePageBuilder questionnaire={qa} label={t('myAccount.label')} />;
}

export default Page;
