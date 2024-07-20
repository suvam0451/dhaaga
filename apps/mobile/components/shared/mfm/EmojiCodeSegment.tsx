import { memo, useEffect, useState } from 'react';
import { EmojiService } from '../../../services/emoji.service';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { Text, Image as RNImage } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import { Image } from 'expo-image';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { randomUUID } from 'expo-crypto';

type Props = {
	value: string;
	remoteInstance: string;
	emojiMap: Map<string, EmojiMapValue>;
};

const EMOJI_HEIGHT = 16;
const EmojiCodeSegment = memo(function Foo({
	emojiMap,
	value,
	remoteInstance,
}: Props) {
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const k = randomUUID();
	const match = EmojiService.findCachedEmoji({
		emojiMap,
		db,
		globalDb,
		id: value,
		remoteInstance,
	});

	if (!match)
		return (
			<Text key={k} style={{ color: APP_THEME.INVALID_ITEM_BODY }}>
				{`:${value}:`}
			</Text>
		);

	const [Width, setWidth] = useState(EMOJI_HEIGHT);

	useEffect(() => {
		RNImage.getSize(
			match,
			(width, height) => {
				setWidth(width * (EMOJI_HEIGHT / height));
			},
			(error) => {
				setWidth(EMOJI_HEIGHT);
			},
		);
	}, [match]);

	return (
		<Text key={k} style={{}}>
			{/*@ts-ignore-next-line*/}
			<Image
				style={{
					width: Width,
					height: EMOJI_HEIGHT,
					opacity: 0.87,
				}}
				source={{ uri: match }}
			/>
		</Text>
	);
});

export default EmojiCodeSegment;
