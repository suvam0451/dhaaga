import { ProfileService } from '@dhaaga/db';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';

function useProfile() {
	const { acct } = useAppAcct();
	const { db } = useAppDb();
	function add(name: string, onSuccess: () => void) {
		ProfileService.addProfile(db, acct, name);
		onSuccess();
	}

	return { add };
}

export default useProfile;
