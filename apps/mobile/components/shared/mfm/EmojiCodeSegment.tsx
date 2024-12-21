import { memo, useEffect, useState } from 'react';
import { Image as RNImage, Text } from 'react-native';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { RandomUtil } from '../../../utils/random.utils';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

type Props = {
	value: string;
	remoteInstance: string;
	emojiMap: Map<string, string>;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
	fontFamily: string;
};

const EMOJI_HEIGHT = 20;

const EmojiCodeSegment = memo(function Foo({
	emojiMap,
	value,
	remoteInstance,
	emphasis,
	fontFamily,
}: Props) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const colorObj = theme.complementaryB;
	let color = null;
	switch (emphasis) {
		case APP_COLOR_PALETTE_EMPHASIS.A0: {
			color = colorObj.a0;
			break;
		}
		case APP_COLOR_PALETTE_EMPHASIS.A10: {
			color = colorObj.a10;
			break;
		}
		case APP_COLOR_PALETTE_EMPHASIS.A20: {
			color = colorObj.a20;
			break;
		}
		case APP_COLOR_PALETTE_EMPHASIS.A30: {
			color = colorObj.a30;
			break;
		}
		case APP_COLOR_PALETTE_EMPHASIS.A40: {
			color = colorObj.a40;
			break;
		}
		case APP_COLOR_PALETTE_EMPHASIS.A50: {
			color = colorObj.a50;
			break;
		}
		default: {
			color = colorObj.a0;
			break;
		}
	}

	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const k = RandomUtil.nanoId();
	const [Width, setWidth] = useState(EMOJI_HEIGHT);

	// const match = EmojiService.findCachedEmoji({
	// 	emojiMap,
	// 	db,
	// 	globalDb,
	// 	id: value,
	// 	remoteInstance,
	// });

	// if (!match)
	return (
		<Text key={k} style={{ color, fontFamily }}>
			{`:${value}:`}
		</Text>
	);

	useEffect(() => {
		// RNImage.getSize(
		// 	match,
		// 	(width, height) => {
		// 		setWidth(width * (EMOJI_HEIGHT / height));
		// 	},
		// 	() => {
		// 		setWidth(EMOJI_HEIGHT);
		// 	},
		// );
	}, []);

	return (
		<Text style={{ alignItems: 'flex-end', flex: 1, position: 'relative' }}>
			<RNImage
				style={{
					width: Width,
					height: EMOJI_HEIGHT,
					top: 16,
					position: 'absolute',
				}}
				// source={{ uri: match }}
			/>
		</Text>
	);
});

export default EmojiCodeSegment;
