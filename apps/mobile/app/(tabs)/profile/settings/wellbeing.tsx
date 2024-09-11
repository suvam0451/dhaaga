import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../../components/containers/WithAutoHideTopNavBar';
import Animated from 'react-native-reanimated';

const WellbeingSettingsPage = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd();
	return (
		<WithAutoHideTopNavBar title={'Wellbeing Settings'} translateY={translateY}>
			<Animated.ScrollView
				contentContainerStyle={{
					paddingTop: 54,
					paddingHorizontal: 8,
				}}
			></Animated.ScrollView>
		</WithAutoHideTopNavBar>
	);
});

export default WellbeingSettingsPage;
