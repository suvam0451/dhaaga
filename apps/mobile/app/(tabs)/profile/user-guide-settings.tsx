import UserGuideContainer from '../../../components/containers/UserGuideContainer';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

const NS = { ns: LOCALIZATION_NAMESPACE.GUIDES };
const NS_OBJ = {
	ns: LOCALIZATION_NAMESPACE.GUIDES,
	returnObjects: true,
};

function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GUIDES]);
	const qa: { question: string; answers: string[] }[] = [
		{
			question: t(`settings.qWhereAmI`, NS),
			answers: t(`settings.aWhereAmI`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`settings.qServerSettingMismatch`),
			answers: t(
				`settings.aServerSettingMismatch`,
				NS_OBJ,
			) as unknown as string[],
		},
		{
			question: t(`settings.qProGetHow`),
			answers: t(`settings.aProGetHow`, NS_OBJ) as unknown as string[],
		},
		{
			question: t(`settings.qSupportHow`),
			answers: t(`settings.aSupportHow`, NS_OBJ) as unknown as string[],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (Settings)'}
			language={'en'}
		/>
	);
}

export default Page;
