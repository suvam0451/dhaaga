import {
	StatusInterface,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import StatusItem from '../../../../../common/status/StatusItem';
import WithActivitypubStatusContext from '../../../../../../states/useStatus';

function DiscoverListRenderer({
	item,
}: {
	item: UserInterface | StatusInterface | TagInterface;
}) {
	return (
		<WithActivitypubStatusContext statusInterface={item as StatusInterface}>
			<StatusItem />
		</WithActivitypubStatusContext>
	);
}

export default DiscoverListRenderer;
