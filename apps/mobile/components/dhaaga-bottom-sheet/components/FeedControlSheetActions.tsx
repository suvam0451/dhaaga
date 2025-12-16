import { View } from 'react-native';
import BottomSheetActionItem from '#/ui/BottomSheetActionItem';

type Props = {
	onOpenInBrowser: () => void;
	onShare: () => void;
	onPinToggle: () => void;
	isPinned: boolean;
};

function FeedControlSheetActions({
	onOpenInBrowser,
	onShare,
	onPinToggle,
	isPinned,
}: Props) {
	return (
		<View>
			<BottomSheetActionItem
				iconId={'share'}
				label={'Copy or Share Link'}
				onPress={onShare}
				desc={'Opens the sharing sheet'}
			/>
			<BottomSheetActionItem
				iconId={'browser'}
				label={'Open in Browser'}
				onPress={onOpenInBrowser}
				desc={'View in external browser'}
			/>
		</View>
	);
}

export default FeedControlSheetActions;
