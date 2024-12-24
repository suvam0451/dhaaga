import { useEffect, useRef, useState } from 'react';
import {
	useAppBottomSheet_Improved,
	useAppManager,
	useAppTheme,
	useProfileManager,
} from '../../../hooks/utility/global-state-extractors';
import { View } from 'react-native';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { ProfilePinnedUserService } from '../../../database/entities/profile-pinned-user';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AppMenu } from '../../lib/Menu';

function AppBottomSheetUserMoreActions() {
	const currentTarget = useRef(null);
	const { stateId } = useAppBottomSheet_Improved();
	const { appManager } = useAppManager();
	const { profileManager } = useProfileManager();
	const { theme } = useAppTheme();

	const [IsPinnedForProfile, setIsPinnedForProfile] = useState(false);

	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	useEffect(() => {
		const userId = appManager.storage.getUserId();
		if (!userId) {
			currentTarget.current = null;

			return;
		}
		const isPinned = ProfilePinnedUserService.isPinnedForProfile(
			db,
			profileManager.profile,
			profileManager.acct.server,
			userId,
		);
		setIsPinnedForProfile(isPinned);
	}, [stateId]);

	return (
		<View>
			<AppMenu.Option
				active={IsPinnedForProfile}
				label={'Add Pin'}
				activeLabel={'Remove Pin'}
				appIconId={
					<AntDesign
						name={'like1'}
						size={24}
						color={theme.complementary.a0}
						onClick={() => {}}
					/>
				}
				onPress={() => {
					console.log('pin option selected');
				}}
			/>
		</View>
	);
}

export default AppBottomSheetUserMoreActions;
