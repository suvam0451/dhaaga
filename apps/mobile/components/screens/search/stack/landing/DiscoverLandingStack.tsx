import { memo } from 'react';
import WithScrollOnRevealContext from '../../../../../states/useScrollOnReveal';
import WithAppPaginationContext from '../../../../../states/usePagination';
import DiscoverTabFactory from './fragments/DiscoverTabFactory';

/**
 * The landing page for the
 * discover module
 */
const DiscoverLandingStack = memo(() => {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<DiscoverTabFactory />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
});

export default DiscoverLandingStack;
