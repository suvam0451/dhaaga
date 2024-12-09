import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../styles/AppTheme';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';

const PinnedTimelines = memo(function Foo() {
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
	});

	return (
		<AppTopNavbar
			title={'Pinned Timelines'}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			translateY={translateY}
		>
			<View>
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
					This feature is not implemented yet
				</Text>
			</View>
		</AppTopNavbar>
	);
});

export default PinnedTimelines;
