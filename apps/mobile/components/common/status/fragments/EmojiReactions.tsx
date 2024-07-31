import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { useActivitypubStatusContext } from '../../../../states/useStatus';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

const EMOJI_COLLAPSED_COUNT_LIMIT = 10;

const EmojiReactions = memo(function Foo() {
	const { domain } = useActivityPubRestClientContext();
	const { status, sharedStatus } = useActivitypubStatusContext();

	const _status = status?.isReposted() ? sharedStatus : status;
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);
	const [AllEmojisExpanded, setAllEmojisExpanded] = useState(false);

	const onShowMoreToggle = useCallback(() => {
		setAllEmojisExpanded((o) => !o);
	}, []);

	useEffect(() => {
		if (domain === 'mastodon') return;

		const emojis = _status.getReactionEmojis();
		const reactions = _status.getReactions();
		let retval: EmojiDto[] = [];

		const localEx = /:(.*?)@.:/;
		const ex = /:(.*?):/;
		for (const reaction of reactions) {
			if (localEx.test(reaction.id)) {
				const _name = localEx.exec(reaction.id)[1];
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
				}
			} else if (ex.test(reaction.id)) {
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
	}, [status, sharedStatus]);

	if (domain === 'mastodon') return <Fragment />;

	const ShownEmojis = AllEmojisExpanded
		? Emojis
		: Emojis.slice(0, EMOJI_COLLAPSED_COUNT_LIMIT);
	return (
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				marginTop: ShownEmojis.length > 0 ? 6 : 0,
			}}
		>
			{ShownEmojis.map((o, i) => (
				<EmojiReaction key={i} dto={o} />
			))}
			{Emojis.length > EMOJI_COLLAPSED_COUNT_LIMIT && (
				<TouchableOpacity onPress={onShowMoreToggle}>
					<View style={styles.showAllEmojiButtonContainer}>
						<View>
							<Text style={styles.showAllEmojiButtonText}>
								{AllEmojisExpanded
									? 'Less'
									: `More (${Emojis.length - ShownEmojis.length})`}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	showAllEmojiButtonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#303030',
		padding: 8,
		borderRadius: 8,
	},
	showAllEmojiButtonText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
export default EmojiReactions;
