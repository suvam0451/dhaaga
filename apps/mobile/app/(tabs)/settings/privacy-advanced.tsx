import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import { Animated, Text, TouchableOpacity } from 'react-native';

const PrivacySettingsPage = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar
			title={'Advanced Privacy Settings'}
			translateY={translateY}
		>
			<Animated.ScrollView
				contentContainerStyle={{ paddingTop: 54, height: '100%' }}
			>
				<TouchableOpacity>
					<Text>Remote Instance Calls</Text>
					<Text>
						Dhaaga makes remote instance calls to improve and fix federation
						issues, and offer a consistent experience. You can opt out of these
						features.
					</Text>
				</TouchableOpacity>
			</Animated.ScrollView>
		</WithAutoHideTopNavBar>
	);
});

export default PrivacySettingsPage;
