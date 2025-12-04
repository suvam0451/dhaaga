import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Image, ImageErrorEventData, ImageLoadEventData } from 'expo-image';
import { RandomUtil } from '@dhaaga/bridge';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';

type Props = {
	value: string;
	emojiMap: Map<string, string>;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
	fontFamily: string;
};

const EMOJI_HEIGHT = 20;

function EmojiCodeSegment({ emojiMap, value, emphasis, fontFamily }: Props) {
	const [ReactionData, setReactionData] =
		useState<InstanceApi_CustomEmojiDTO>(null);
	const [EmojiWidth, setEmojiWidth] = useState(EMOJI_HEIGHT);
	const { theme } = useAppTheme();
	const { acctManager } = useGlobalState(
		useShallow((o) => ({
			acctManager: o.acctManager,
		})),
	);
	const { dto } = withPostItemContext();

	let color = AppThemingUtil.getColorForEmphasis(
		theme.complementaryB,
		emphasis,
	);

	const k = RandomUtil.nanoId();

	useEffect(() => {
		if (!acctManager) return;
		setReactionData(acctManager.resolveEmoji(value, emojiMap));
	}, [value]);

	function onLoad(event: ImageLoadEventData) {
		setEmojiWidth(event.source.width * (EMOJI_HEIGHT / event.source.height));
	}

	function onError(event: ImageErrorEventData) {
		setEmojiWidth(EMOJI_HEIGHT);
	}

	if (!ReactionData)
		return (
			<Text key={k} style={{ color, fontFamily }}>
				{`:${value}:`}
			</Text>
		);

	return (
		<Image
			key={k}
			style={{
				width: EmojiWidth,
				height: EMOJI_HEIGHT,
			}}
			onLoad={onLoad}
			onError={onError}
			source={{ uri: ReactionData.url }}
			priority={'low'}
			recyclingKey={value}
		/>
	);
}

export default EmojiCodeSegment;
