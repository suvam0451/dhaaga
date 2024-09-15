import {
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import StatusItem from '../../../../../common/status/StatusItem';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import WithActivitypubUserContext from '../../../../../../states/useProfile';
import UserSearchResultListing from '../../../../../common/user/UserSearchResultListing';
import WithAppStatusItemContext from '../../../../../../hooks/ap-proto/useAppStatusItem';
import { View } from 'react-native';
import { FlashListType_Post } from '../../../../../../services/flashlist.service';
import { ActivityPubAppUserDtoType } from '../../../../../../services/approto/activitypub-user-dto.service';

function DiscoverListRenderer({
	item,
	category,
}: {
	item: ActivityPubAppUserDtoType | FlashListType_Post | TagInterface;
	category: APP_SEARCH_TYPE;
}) {
	switch (category) {
		case APP_SEARCH_TYPE.POSTS:
			return (
				<WithAppStatusItemContext dto={(item as FlashListType_Post).props.dto}>
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
