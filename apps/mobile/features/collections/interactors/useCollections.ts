import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { AccountCollectionService } from '../../../database/entities/account-collection';

function useCollections() {
	const { acct } = useAppAcct();
	const { db } = useAppDb();

	function add(text: string) {
		if (!text) return;

		AccountCollectionService.addCollection(db, acct, text);
	}

	return { add };
}

export default useCollections;
