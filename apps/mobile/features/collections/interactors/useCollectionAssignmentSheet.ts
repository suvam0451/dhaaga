import {
	useAppBottomSheet_Improved,
	useAppPublishers,
} from '../../../hooks/utility/global-state-extractors';
import { useState } from 'react';
import { AppPostObject } from '../../../types/app-post.types';

function useCollectionAssignmentSheet() {
	const { ctx } = useAppBottomSheet_Improved();
	const { postPub } = useAppPublishers();
	const [PostObject, setPostObject] = useState<AppPostObject>(
		postPub.readCache(ctx?.uuid),
	);
}

export default useCollectionAssignmentSheet;
