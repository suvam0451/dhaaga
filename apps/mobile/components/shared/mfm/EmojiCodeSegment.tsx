import { memo, useEffect, useState } from 'react';
import { Text, Image as RNImage } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { randomUUID } from 'expo-crypto';

type Props = {
	value: string;
	remoteInstance: string;
	emojiMap: Map<string, string>;
};

const EMOJI_HEIGHT = 20;

const EmojiCodeSegment = memo(function Foo({
	emojiMap,
	value,
	remoteInstance,
}: Props) {
	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const k = randomUUID();
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
		<Text key={k} style={{ color: APP_THEME.INVALID_ITEM_BODY }}>
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
