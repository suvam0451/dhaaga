import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import FeatureUnsupported from '../../../components/error-screen/FeatureUnsupported';
import { View } from 'react-native';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import MyLikes from '../../../components/screens/profile/stack/MyLikes';

function Foo() {
	const { domain } = useActivityPubRestClientContext();
	if (
		[
			KNOWN_SOFTWARE.MISSKEY,
			KNOWN_SOFTWARE.SHARKEY,
			KNOWN_SOFTWARE.ICESHRIMP,
		].includes(domain as any)
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
