import { memo, useEffect, useState } from 'react';
import { Text, Image as RNImage } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { RandomUtil } from '../../../utils/random.utils';

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
		<Text key={k} style={{ color: '#8c94fe' }}>
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
