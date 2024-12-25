import { memo } from 'react';
import { Text } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

const PinnedTimelines = memo(function Foo() {
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
	});
	const { theme } = useAppTheme();

	return (
		<AppTopNavbar
			title={'Pinned Timelines'}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			translateY={translateY}
		>
			<Text style={{ color: theme.secondary.a20 }}>
				This feature is not implemented yet
			</Text>
		</AppTopNavbar>
	);
});

export default PinnedTimelines;
