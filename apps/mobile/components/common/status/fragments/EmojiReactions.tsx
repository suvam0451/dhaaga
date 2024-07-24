import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Fragment, memo, useEffect, useState } from 'react';
import { useActivitypubStatusContext } from '../../../../states/useStatus';
import { View } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';

const EmojiReactions = memo(function Foo() {
	const { domain } = useActivityPubRestClientContext();
	const { status, sharedStatus } = useActivitypubStatusContext();

	const _status = status?.isReposted() ? sharedStatus : status;
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);

	useEffect(() => {
		if (domain === 'mastodon') return;

		const emojis = _status.getReactionEmojis();
		const reactions = _status.getReactions();
		let retval: EmojiDto[] = [];

		const ex = /:(.*?):/;
		for (const reaction of reactions) {
			if (ex.test(reaction.id)) {
				const _name = ex.exec(reaction.id)[1];
				const match = emojis.find((o) => o.name === _name);
				if (match) {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'image',
						url: match.url,
						width: match.width,
						height: match.height,
					});
				} else {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'text',
					});
				}
			} else {
				retval.push({ name: reaction.id, count: reaction.count, type: 'text' });
			}

			retval = retval.sort((a, b) => b.count - a.count);
			setEmojis(retval);
		}
	}, [_status]);

	if (domain === 'mastodon') return <Fragment />;

	return (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
			{Emojis.map((o, i) => (
				<EmojiReaction key={i} dto={o} />
			))}
		</View>
	);
});

export default EmojiReactions;
