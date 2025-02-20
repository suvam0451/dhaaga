import { useEffect, useRef, useState } from 'react';
import {
	useAppBottomSheet,
	useAppDb,
	useAppManager,
	useProfileManager,
} from '../../../hooks/utility/global-state-extractors';
import { View } from 'react-native';
import { ProfilePinnedUserService } from '../../../database/entities/profile-pinned-user';
import { AppMenuItem } from '../../lib/Menu';
import type { UserObjectType } from '@dhaaga/core';

function AppBottomSheetUserMoreActions() {
	const currentTargetId = useRef(null);
	const currentTargetObj = useRef<UserObjectType>(null);
	const { stateId } = useAppBottomSheet();
	const { appManager } = useAppManager();
	const { profileManager } = useProfileManager();

	const [IsPinnedForProfile, setIsPinnedForProfile] = useState(false);

	const { db } = useAppDb();
	useEffect(() => {
		const userId = appManager.storage.getUserId();
		const userObj = appManager.storage.getUserObject();
		if (!userId) {
			currentTargetId.current = null;
			currentTargetObj.current = null;
			return;
		}
		currentTargetId.current = userId;
		currentTargetObj.current = userObj;

		const isPinned = ProfilePinnedUserService.isPinnedForProfile(
			db,
			profileManager.profile,
			profileManager.acct.server,
			userId,
		);
		setIsPinnedForProfile(isPinned);
	}, [stateId]);

	function onTogglePin() {
		if (!currentTargetId.current || !currentTargetObj.current) return;
		const isPinned = ProfilePinnedUserService.isPinnedForProfile(
			db,
			profileManager.profile,
			profileManager.acct.server,
			currentTargetId.current,
		);
		if (!isPinned) {
			profileManager.pinUser(
				profileManager.acct.server,
				currentTargetObj.current,
			);
		}
		setIsPinnedForProfile(true);
	}
	return (
		<View style={{ paddingHorizontal: 10, marginTop: 24 }}>
			{/*<AppMenu.Option*/}
			{/*	active={IsPinnedForProfile}*/}
			{/*	label={'Pin to Social Hub'}*/}
			{/*	activeLabel={'Remove from Social Hub'}*/}
			{/*	desc={'Adds this user to quick access'}*/}
			{/*	appIconId={*/}
			{/*		<AppIcon*/}
			{/*			id={'pin-octicons'}*/}
			{/*			size={24}*/}
			{/*			color={theme.complementary.a0}*/}
			{/*			onPress={() => {}}*/}
			{/*		/>*/}
			{/*	}*/}
			{/*	onPress={onTogglePin}*/}
			{/*/>*/}

			{/*<AppDivider.Hard*/}
			{/*	style={{*/}
			{/*		marginVertical: 8,*/}
			{/*		marginTop: 16,*/}
			{/*		marginHorizontal: 10,*/}
			{/*		backgroundColor: '#363636',*/}
			{/*	}}*/}
			{/*/>*/}
			<AppMenuItem
				appIconId={'mute-outline'}
				label={'Mute'}
				desc={'[NOTE] --> Not Implemented'}
				onPress={() => {}}
			/>
			<AppMenuItem
				appIconId={'block'}
				label={'Block'}
				desc={'[NOTE] --> Not Implemented'}
				onPress={() => {}}
			/>
		</View>
	);
}

export default AppBottomSheetUserMoreActions;
