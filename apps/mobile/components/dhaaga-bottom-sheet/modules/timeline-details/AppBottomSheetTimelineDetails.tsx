import NowBrowsingHeader from '../../../widgets/feed-controller/core/NowBrowsingHeader';
import { ScrollView } from 'react-native';
import { AppDivider } from '../../../lib/Divider';
import { AppMenu } from '../../../lib/Menu';
import { AppIcon } from '../../../lib/Icon';

import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';

function AppBottomSheetTimelineDetails() {
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 36 }}>
			<NowBrowsingHeader />
			<AppDivider.Soft style={{ marginHorizontal: 10 }} />
			<AppMenu.Option
				Icon={
					<AppIcon id={'to-top'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Scroll to Top'}
				onClick={() => {}}
			/>
			<AppMenu.Option
				Icon={<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />}
				label={'Add Pin'}
				onClick={() => {}}
				desc={'Pins the timeline for this profile in Social Hub'}
			/>

			<AppMenu.Option
				Icon={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Open in Browser'}
				onClick={() => {}}
				desc={'Opens the timeline in your device browser'}
			/>
		</ScrollView>
	);
}

export default AppBottomSheetTimelineDetails;
