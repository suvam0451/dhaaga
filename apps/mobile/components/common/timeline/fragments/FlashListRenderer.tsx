import { ListItemEnum, ListItemType } from '../utils/itemType.types';
import StatusItem from '../../status/StatusItem';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';

const FlashListRenderer = ({ item }: { item: ListItemType }) => {
	switch (item.type) {
		case ListItemEnum.ListItemWithImage: {
			return (
				<WithAppStatusItemContext dto={item.props.dto}>
					<StatusItem />
				</WithAppStatusItemContext>
			);
		}
		case ListItemEnum.ListItemWithText: {
			return (
				<WithAppStatusItemContext dto={item.props.dto}>
					<StatusItem />
				</WithAppStatusItemContext>
			);
		}
		case ListItemEnum.ListItemWithSpoiler: {
			return (
				<WithAppStatusItemContext dto={item.props.dto}>
					<StatusItem />
				</WithAppStatusItemContext>
			);
		}
		default: {
			console.log('[WARN]: you have not indicated a timeline item type');
		}
	}
};

export default FlashListRenderer;
