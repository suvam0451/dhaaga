import { ListItemEnum, ListItemType } from '../utils/itemType.types';
import StatusItem from '../../status/StatusItem';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import { View } from 'react-native';

/**
 * Renders a list of posts into a FlashList
 * @param item post object
 * @constructor
 */
const FlashListPostRenderer = ({ item }: { item: ListItemType }) => {
	if (item.props.dto === null) {
		console.log('[WARN]: recieved null object', item);
		return <View />;
	}

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

export default FlashListPostRenderer;
