import { useEffect } from 'react';
import { View } from 'react-native';
import {
	useActiveUserSession,
	useAppActiveSession,
	useHub,
} from '#/states/global/hooks';
import SignedOutScreen from '#/features/onboarding/SignedOutScreen';
import SessionLoadingScreen from '#/features/onboarding/SessionLoadingScreen';
import HubTab from '#/features/hub/HubTab';

function Page() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();
	const { loadAccounts } = useHub();
	const { profiles, pageIndex } = useHub();

	useEffect(() => {
		loadAccounts();
	}, [acct]);

	if (!acct) {
		if (session.state === 'no-account' || session.state === 'invalid')
			return <SignedOutScreen />;
		else if (session.state === 'idle' || session.state === 'loading')
			return <SessionLoadingScreen />;
	}
	if (profiles?.length === 0) return <View />;
	return <HubTab profile={profiles[pageIndex]} />;
}

export default Page;
