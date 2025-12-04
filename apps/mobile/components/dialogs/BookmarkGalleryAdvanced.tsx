import { AppButtonVariantA, AppButtonVariantDestructive } from '../lib/Buttons';
import useSyncWithProgress, {
	ACTIVITYPUB_SYNC_TASK,
} from '../hooks/tasks/useSyncWithProgress';
import { RneuiDialogProps } from './_types';
import { ActivityIndicator, View, Text } from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';

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
		<>
			<AppButtonVariantA
				label={'Sync Again'}
				loading={IsTaskRunning}
				onClick={onSyncClick}
				opts={{ useHaptics: true }}
				customLoadingState={
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
							{Numerator}/?
						</Text>
						<ActivityIndicator
							size={20}
							color={APP_FONT.MONTSERRAT_BODY}
							style={{ marginLeft: 8 }}
						/>
					</View>
				}
			/>
			{/*<LastSyncedStatus id={LAST_SYNCED_STATUS_KEY.BOOKMARK_SYNC} />*/}
			<View style={{ height: 16 }} />
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
		</>
	);
}

export default BookmarkGalleryAdvanced;
