import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import ActivityPubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const EMOJI_COLLAPSED_COUNT_LIMIT = 10;

type EmojiReactionsProps = {
	dto: ActivityPubStatusAppDtoType;
};
const EmojiReactions = memo(({ dto }: EmojiReactionsProps) => {
	const { emojiCache } = useAppTimelinePosts();
	const { domain, me } = useActivityPubRestClientContext();
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);
	const [AllEmojisExpanded, setAllEmojisExpanded] = useState(false);
	const { colorScheme } = useAppTheme();

	const onShowMoreToggle = useCallback(() => {
		setAllEmojisExpanded((o) => !o);
	}, []);

	useEffect(() => {
		setEmojis(
			ActivityPubReactionsService.renderData(dto.stats.reactions, {
				calculated: dto.calculated.reactionEmojis,
				cache: emojiCache,
				me: me?.getId(),
			}),
		);
	}, [dto.stats.reactions, me]);

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
				<EmojiReaction key={i} dto={o} postDto={dto} />
			))}
			{Emojis.length > EMOJI_COLLAPSED_COUNT_LIMIT && (
				<TouchableOpacity onPress={onShowMoreToggle}>
					<View
						style={[
							styles.showAllEmojiButtonContainer,
							{
								backgroundColor: colorScheme.reactions.active,
							},
						]}
					>
						<View>
							<Text
								style={[
									styles.showAllEmojiButtonText,
									{ color: colorScheme.textColor.medium },
								]}
							>
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
		paddingVertical: 6,
		borderRadius: 8,
	},
	showAllEmojiButtonText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
export default EmojiReactions;
