import { useEffect, useState } from 'react';
import { Image, ImageErrorEventData, ImageLoadEventData } from 'expo-image';
import { type CustomEmojiObjectType, RandomUtil } from '@dhaaga/bridge';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '#/utils/theming.util';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium } from '#/ui/NativeText';

type Props = {
	value: string;
	emojiMap: Map<string, string>;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
	fontFamily: string;
};

const EMOJI_HEIGHT = 20;

function EmojiCodeSegment({ emojiMap, value, emphasis, fontFamily }: Props) {
	const [ReactionData, setReactionData] = useState<CustomEmojiObjectType>(null);
	const [EmojiWidth, setEmojiWidth] = useState(EMOJI_HEIGHT);
	const { theme } = useAppTheme();
	const { acctManager } = useActiveUserSession();

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
			<NativeTextMedium
				color={theme.secondary.a50}
			>{`:${value}:`}</NativeTextMedium>
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
