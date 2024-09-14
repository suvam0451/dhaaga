import { memo } from 'react';
import WithScrollOnRevealContext from '../../../../../states/useScrollOnReveal';
import WithAppPaginationContext from '../../../../../states/usePagination';
import DiscoverTabFactory from './fragments/DiscoverTabFactory';
import WithAppTimelineDataContext from '../../../../../hooks/app/timelines/useAppTimelinePosts';

/**
 * The landing page for the
 * discover module
 */
const DiscoverLandingStack = memo(() => {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<WithAppTimelineDataContext>
					<DiscoverTabFactory />
				</WithAppTimelineDataContext>
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
});

export default DiscoverLandingStack;
