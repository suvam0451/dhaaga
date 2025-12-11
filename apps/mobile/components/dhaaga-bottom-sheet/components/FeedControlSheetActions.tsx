import { View } from 'react-native';
import { AppMenu } from '#/components/lib/Menu';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useActiveProfile } from '#/states/global/hooks';

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
	const { profile } = useActiveProfile();
	return (
		<View>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'pin'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={isPinned ? 'Unpin From Hub' : 'Pin to Hub'}
				onPress={onPinToggle}
				desc={`Selected Profile: ${profile?.name}`}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'share'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Copy or Share Link'}
				onPress={onShare}
				desc={'Opens the sharing sheet'}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Open in Browser'}
				onPress={onOpenInBrowser}
				desc={'View in external browser'}
			/>
		</View>
	);
}

export default FeedControlSheetActions;
