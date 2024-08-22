import MyFavouritesPage from '../../../components/screens/favourites/stack/MyFavouritesPage';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import FeatureUnsupported from '../../../components/error-screen/FeatureUnsupported';

function Foo() {
	const { domain } = useActivityPubRestClientContext();
	if (
		[
			KNOWN_SOFTWARE.MISSKEY,
			KNOWN_SOFTWARE.SHARKEY,
			KNOWN_SOFTWARE.ICESHRIMP,
		].includes(domain as any)
	) {
		return <FeatureUnsupported />;
	}

	return <MyFavouritesPage />;
}

export default Foo;
