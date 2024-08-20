import {
	StatusInterface,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import StatusItem from '../../../../../common/status/StatusItem';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import WithActivitypubUserContext from '../../../../../../states/useProfile';
import UserSearchResultListing from '../../../../../common/user/UserSearchResultListing';
import WithAppStatusItemContext from '../../../../../../hooks/ap-proto/useAppStatusItem';
import { ActivityPubStatusAppDtoType } from '../../../../../../services/ap-proto/activitypub-status-dto.service';
import { View } from 'react-native';

function DiscoverListRenderer({
	item,
	category,
}: {
	item:
		| UserInterface
		| StatusInterface
		| TagInterface
		| ActivityPubStatusAppDtoType;
	category: APP_SEARCH_TYPE;
}) {
	switch (category) {
		case APP_SEARCH_TYPE.POSTS:
			return (
				<WithAppStatusItemContext dto={item as ActivityPubStatusAppDtoType}>
					<StatusItem />
				</WithAppStatusItemContext>
			);
		case APP_SEARCH_TYPE.USERS:
			return (
				<WithActivitypubUserContext userI={item as UserInterface}>
					<UserSearchResultListing />
				</WithActivitypubUserContext>
			);
		default:
			return <View />;
	}
}

export default DiscoverListRenderer;
