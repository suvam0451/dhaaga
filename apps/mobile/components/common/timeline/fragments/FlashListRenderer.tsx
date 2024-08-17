import { ListItemEnum, ListItemType } from '../utils/itemType.types';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import StatusItem from '../../status/StatusItem';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';

const FlashListRenderer = ({ item }: { item: ListItemType }) => {
	switch (item.type) {
		case ListItemEnum.ListItemWithImage: {
			return (
				<WithActivitypubStatusContext statusInterface={item.props.post}>
					<WithAppStatusItemContext dto={item.props.dto}>
						<StatusItem />
					</WithAppStatusItemContext>
				</WithActivitypubStatusContext>
			);
		}
		case ListItemEnum.ListItemWithText: {
			return (
				<WithActivitypubStatusContext statusInterface={item.props.post}>
					<WithAppStatusItemContext dto={item.props.dto}>
						<StatusItem />
					</WithAppStatusItemContext>
				</WithActivitypubStatusContext>
			);
		}
		case ListItemEnum.ListItemWithSpoiler: {
			return (
				<WithActivitypubStatusContext statusInterface={item.props.post}>
					<WithAppStatusItemContext dto={item.props.dto}>
						<StatusItem />
					</WithAppStatusItemContext>
				</WithActivitypubStatusContext>
			);
		}
		default: {
			console.log('[WARN]: you have not indicated a timeline item type');
		}
	}
};

export default FlashListRenderer;
