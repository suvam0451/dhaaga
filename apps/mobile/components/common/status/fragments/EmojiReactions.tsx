import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import { useAppTimelineDataContext } from '../../timeline/api/useTimelineData';

const EMOJI_COLLAPSED_COUNT_LIMIT = 10;

type EmojiReactionsProps = {
	dto: ActivityPubStatusAppDtoType;
};
const EmojiReactions = memo(({ dto }: EmojiReactionsProps) => {
	const { emojiCache } = useAppTimelineDataContext();
	const { domain } = useActivityPubRestClientContext();
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);
	const [AllEmojisExpanded, setAllEmojisExpanded] = useState(false);

	const onShowMoreToggle = useCallback(() => {
		setAllEmojisExpanded((o) => !o);
	}, []);

	useEffect(() => {
		const emojis = dto.calculated.reactionEmojis;
		let retval: EmojiDto[] = [];

		const localEx = /:(.*?)@.:/;
		const ex = /:(.*?):/;
		for (const reaction of dto.stats.reactions) {
			if (localEx.test(reaction.id)) {
				const _name = localEx.exec(reaction.id)[1];
				const match = emojiCache.find(
					(o) => o.shortCode === _name || o.aliases.includes(_name),
				);
				if (match) {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'image',
						url: match.url,
						interactable: true,
					});
				} else {
					console.log('[WARN]: local emoji not found for', _name);
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
						interactable: false,
					});
				} else {
					retval.push({
						name: reaction.id,
						count: reaction.count,
						type: 'text',
						interactable: false,
					});
				}
			} else {
				retval.push({
					name: reaction.id,
					count: reaction.count,
					type: 'text',
					interactable: true,
				});
			}

			retval = retval.sort((a, b) => b.count - a.count);
		}
		setEmojis(retval);
	}, [dto]);

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
