import { Fragment, memo, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { appDimensions } from '../../../../styles/dimensions';

const EMOJI_COLLAPSED_COUNT_LIMIT = 10;

type EmojiReactionsProps = {
	dto: ActivityPubStatusAppDtoType;
};

const EmojiReactions = memo(({ dto }: EmojiReactionsProps) => {
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);
	const [AllEmojisExpanded, setAllEmojisExpanded] = useState(false);

	const { driver, theme, acctManager } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			theme: o.colorScheme,
			acctManager: o.acctManager,
		})),
	);

	function onShowMoreToggle() {
		setAllEmojisExpanded((o) => !o);
	}

	useEffect(() => {
		setEmojis(
			acctManager.resolveReactions(
				dto.stats.reactions,
				dto.calculated.reactionEmojis,
			),
		);
	}, [dto.stats.reactions, dto.calculated.reactionEmojis, acctManager]);

	if (driver === KNOWN_SOFTWARE.MASTODON) return <Fragment />;

	const ShownEmojis = AllEmojisExpanded
		? Emojis
		: Emojis.slice(0, EMOJI_COLLAPSED_COUNT_LIMIT);

	if (ShownEmojis.length === 0) return <View />;

	return (
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				marginBottom: appDimensions.timelines.sectionBottomMargin,
				// extra spacing, since it needs to accept touch
				marginTop: 6,
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
								backgroundColor: theme.reactions.active,
							},
						]}
					>
						<View>
							<Text
								style={[
									styles.showAllEmojiButtonText,
									{ color: theme.textColor.medium },
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
