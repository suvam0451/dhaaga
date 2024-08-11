import {
	StatusInterface,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import StatusItem from '../../../../../common/status/StatusItem';
import WithActivitypubStatusContext from '../../../../../../states/useStatus';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import WithActivitypubUserContext from '../../../../../../states/useProfile';
import UserSearchResultListing from '../../../../../common/user/UserSearchResultListing';

function DiscoverListRenderer({
	item,
	category,
}: {
	item: UserInterface | StatusInterface | TagInterface;
	category: APP_SEARCH_TYPE;
}) {
	switch (category) {
		case APP_SEARCH_TYPE.POSTS:
			return (
				<WithActivitypubStatusContext statusInterface={item as StatusInterface}>
					<StatusItem />
				</WithActivitypubStatusContext>
			);
		case APP_SEARCH_TYPE.USERS:
			return (
				<WithActivitypubUserContext userI={item as UserInterface}>
					<UserSearchResultListing />
				</WithActivitypubUserContext>
			);
		default:
			return (
				<WithActivitypubStatusContext statusInterface={item as StatusInterface}>
					<StatusItem />
				</WithActivitypubStatusContext>
			);
	}
}

export default DiscoverListRenderer;
