import { Fragment, memo, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Image } from 'expo-image';
import { RandomUtil } from '../../../utils/random.utils';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	value: string;
	remoteInstance: string;
	emojiMap: Map<string, string>;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
	fontFamily: string;
};

const EMOJI_HEIGHT = 22;

const EmojiCodeSegment = memo(function Foo({
	emojiMap,
	value,
	emphasis,
	fontFamily,
}: Props) {
	const [ReactionData, setReactionData] =
		useState<InstanceApi_CustomEmojiDTO>(null);
	const { theme } = useAppTheme();
	const { acctManager } = useGlobalState(
		useShallow((o) => ({
			acctManager: o.acctManager,
		})),
	);

	let color = AppThemingUtil.getColorForEmphasis(
		theme.complementaryB,
		emphasis,
	);

	const k = RandomUtil.nanoId();
	const [Width, setWidth] = useState(EMOJI_HEIGHT);

	useEffect(() => {
		if (!acctManager) return;
		const match = acctManager.resolveEmoji(value, emojiMap);
		if (!match) return;
		setReactionData(match);

		Image.loadAsync(match.url)
			.then(({ width, height }) => {
				setWidth(width * (EMOJI_HEIGHT / height));
			})
			.catch((e) => {
				setWidth(EMOJI_HEIGHT);
			});
	}, [value, acctManager]);

	useEffect(() => {}, []);

	if (!ReactionData)
		return (
			<Text key={k} style={{ color, fontFamily }}>
				{`:${value}:`}
			</Text>
		);

	return (
		<Fragment>
			{/*@ts-ignore-next-line*/}
			<Image
				style={{
					width: Width,
					height: EMOJI_HEIGHT,
				}}
				source={{ uri: ReactionData.url }}
			/>
		</Fragment>
	);
});

export default EmojiCodeSegment;
