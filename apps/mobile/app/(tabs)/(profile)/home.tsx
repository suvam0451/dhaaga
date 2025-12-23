import MyHome from '#/features/home/MyHome';
import { useAppActiveSession } from '#/states/global/hooks';
import { AppAuthenticationPager } from '#/app/(tabs)/(profile)/onboard/add-account';

function FifthTab() {
	const { session } = useAppActiveSession();

	if (session.state === 'no-account') return <AppAuthenticationPager />;
	return <MyHome />;
}

export default FifthTab;
