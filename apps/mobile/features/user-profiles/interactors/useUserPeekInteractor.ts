import {
	useAppManager,
	useAppModalState,
} from '../../../hooks/utility/global-state-extractors';
import { APP_KNOWN_MODAL } from '../../../states/_global';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const DEFAULT_POSITION = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	ready: false,
	popoverDirection: 'top' as 'top' | 'bottom',
};

function useUserPeekInteractor() {
	const [Position, setPosition] = useState(DEFAULT_POSITION);
	const [UserIdTarget, setUserIdTarget] = useState(null);

	const { stateId } = useAppModalState(APP_KNOWN_MODAL.USER_PEEK);
	const { height } = Dimensions.get('window');
	const { appManager } = useAppManager();

	useEffect(() => {
		if (!appManager) {
			setPosition(DEFAULT_POSITION);
			setUserIdTarget(null);
			return;
		}

		const data = appManager.storage.getUserPeekModalData();
		if (!data) return;
		if (data.measurement.y >= height / 2) {
			setPosition({
				x: data.measurement.x,
				y: data.measurement.y,
				width: data.measurement.width,
				height: data.measurement.height,
				ready: true,
				popoverDirection: 'top',
			});
			setUserIdTarget(data.userId);
		} else {
			setPosition({
				x: data.measurement.x,
				y: data.measurement.y,
				width: data.measurement.width,
				height: data.measurement.height,
				ready: true,
				popoverDirection: 'bottom',
			});
			setUserIdTarget(data.userId);
		}
	}, [appManager, stateId]);

	return { pos: Position, userId: UserIdTarget };
}

export default useUserPeekInteractor;
