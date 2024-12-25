import NowBrowsingHeader from '../../widgets/feed-controller/core/NowBrowsingHeader';
import { ScrollView } from 'react-native';
import { AppDivider } from '../../lib/Divider';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';

import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { useEffect } from 'react';
import { useAppBottomSheet } from './_api/useAppBottomSheet';
import {
	useAppBottomSheet_Improved,
	useAppBottomSheet_TimelineReference,
} from '../../../hooks/utility/global-state-extractors';

function AppBottomSheetTimelineDetails() {
	const { stateId, visible } = useAppBottomSheet_Improved();
	const { dispatch, draft } = useAppBottomSheet_TimelineReference();

	useEffect(() => {
		if (!visible) return;
	}, [stateId, visible]);

	// apply options when exiting bottom sheet
	useEffect(() => {}, []);

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 36 }}>
			<NowBrowsingHeader />
			<AppDivider.Hard
				style={{
					marginHorizontal: 10,
					marginVertical: 8,
					backgroundColor: '#2c2c2c',
				}}
			/>

			<AppMenu.Option
				appIconId={
					<AppIcon
						id={'pin-octicons'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				}
				label={'Add Pin'}
				onPress={() => {}}
				desc={'Pin this timeline to the Social Hub'}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Open in Browser'}
				onPress={() => {}}
				desc={'View in external browser'}
			/>

			<AppDivider.Hard
				style={{
					marginHorizontal: 10,
					marginVertical: 8,
					backgroundColor: '#2c2c2c',
				}}
			/>

			<AppMenu.Option
				appIconId={
					<AppIcon id={'to-top'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Scroll to Top'}
				onPress={() => {}}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon
						id={'layers-outline'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				}
				label={'Switch Timeline'}
				onPress={() => {}}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon
						id={'layers-outline'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				}
				label={'Switch Timeline'}
				onPress={() => {}}
			/>
		</ScrollView>
	);
}

export default AppBottomSheetTimelineDetails;
