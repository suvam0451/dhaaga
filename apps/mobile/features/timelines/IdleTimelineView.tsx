import { View, Text } from 'react-native';
import TitleOnlyNoScrollContainer from '../../components/containers/TitleOnlyNoScrollContainer';
import { AppIcon } from '../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { AppText } from '../../components/lib/Text';

function IdleTimelineView() {
	return (
		<TitleOnlyNoScrollContainer headerTitle={'Timelines'}>
			<View />
			<View>
				<AppIcon
					id={'layers-outline'}
					size={64}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				/>
				<AppText.SemiBold emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
					Timelines you browse will appear here
				</AppText.SemiBold>
			</View>
		</TitleOnlyNoScrollContainer>
	);
}

export default IdleTimelineView;
