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
			question: 'Where is this?',
			answers: [
				'You can add/remove your SNS accounts from here.',
				'Make sure to select the account from here to mark it active, after the account is added.',
			],
		},
		{
			question: 'Can I use the app offline (or signed out)?',
			answers: [
				'As of now, internet connection and an an active account connection is required.',
				'As the app matures, more features will be made available offline.',
			],
		},
		{
			question: 'Any convenient ways to switch accounts?',
			answers: [
				'Yes. Long pressing the profile tab (5th) will bring up the account switcher interface.',
			],
		},
		{
			question: 'My account does not work.',
			answers: [
				'If the account got added, then there should be no compatibility issue.',
				'In such case, the app should give the error message encountered, as well steps to fix it.',
				'If nothing else works, delete the account using this page and sign-in again.',
			],
		},
	];
	return <GuidePageBuilder questionnaire={qa} label={'Guide (Accounts)'} />;
}

export default Page;
