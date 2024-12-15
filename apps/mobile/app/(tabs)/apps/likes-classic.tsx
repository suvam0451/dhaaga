import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import FeatureUnsupported from '../../../components/error-screen/FeatureUnsupported';
import { View } from 'react-native';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import MyLikes from '../../../components/screens/profile/stack/MyLikes';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function Foo() {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);
	if (
		[
			KNOWN_SOFTWARE.MISSKEY,
			KNOWN_SOFTWARE.SHARKEY,
			KNOWN_SOFTWARE.ICESHRIMP,
		].includes(driver)
	) {
		return (
			<WithAutoHideTopNavBar title={'My Liked Posts'}>
				<View style={{ height: '100%', backgroundColor: '#121212' }}>
					<FeatureUnsupported />
				</View>
			</WithAutoHideTopNavBar>
		);
	}

	return <MyLikes />;
}

export default Foo;
