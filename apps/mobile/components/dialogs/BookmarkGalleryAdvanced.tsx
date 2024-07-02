import { AppButtonVariantA, AppButtonVariantDestructive } from '../lib/Buttons';
import useSyncWithProgress, {
	ACTIVITYPUB_SYNC_TASK,
} from '../hooks/tasks/useSyncWithProgress';
import { Text } from '@rneui/themed';
import { RneuiDialogProps } from './_types';
import AppDialogContainer from '../containers/AppDialogContainer';
import LastSyncedStatus, {
	LAST_SYNCED_STATUS_KEY,
} from '../dataviz/LastSyncedStatus';
import { ActivityIndicator, View } from 'react-native';

function BookmarkGalleryAdvanced({
	IsVisible,
	setIsVisible,
}: RneuiDialogProps) {
	const { Task, IsTaskRunning, Numerator } = useSyncWithProgress(
		ACTIVITYPUB_SYNC_TASK.BOOKMARK_SYNC,
		{},
	);

	const { Task: TaskB, IsTaskRunning: IsTaskRunningB } = useSyncWithProgress(
		ACTIVITYPUB_SYNC_TASK.CLEAR_BOOKMARK_CACHE,
		{},
	);

	function onSyncClick() {
		if (!IsTaskRunning) {
			Task();
		}
	}

	function onClearClick() {
		if (!IsTaskRunningB) {
			TaskB();
		}
	}

	return (
		<AppDialogContainer IsVisible={IsVisible} setIsVisible={setIsVisible}>
			<AppButtonVariantA
				label={'Sync Again'}
				loading={IsTaskRunning}
				onClick={onSyncClick}
				opts={{ useHaptics: true }}
				customLoadingState={
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<Text>{Numerator}/?</Text>
						<ActivityIndicator
							size={20}
							color={'white'}
							style={{ marginLeft: 8 }}
						/>
					</View>
				}
			/>
			<LastSyncedStatus id={LAST_SYNCED_STATUS_KEY.BOOKMARK_SYNC} />
			<View style={{ height: 16 }}></View>
			<AppButtonVariantDestructive
				label={'Clear Cache'}
				loading={IsTaskRunningB}
				onClick={onClearClick}
				customLoadingState={
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<ActivityIndicator
							size={20}
							color={'white'}
							style={{ marginLeft: 8 }}
						/>
					</View>
				}
			/>
		</AppDialogContainer>
	);
}

export default BookmarkGalleryAdvanced;
