import { Fragment, useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { EmojiDto } from './_shared.types';
import EmojiReaction from './EmojiReaction';
import { APP_FONT } from '#/styles/AppTheme';
import { appDimensions } from '#/styles/dimensions';
import type { PostObjectType } from '@dhaaga/bridge';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppTheme,
} from '#/states/global/hooks';
import { DriverService } from '@dhaaga/bridge';
import { NativeTextBold } from '#/ui/NativeText';

const EMOJI_COLLAPSED_COUNT_LIMIT = 10;

type EmojiReactionsProps = {
	dto: PostObjectType;
};

function EmojiReactions({ dto }: EmojiReactionsProps) {
	const [Emojis, setEmojis] = useState<EmojiDto[]>([]);
	const [AllEmojisExpanded, setAllEmojisExpanded] = useState(false);
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	const { acctManager } = useActiveUserSession();
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

	// mastodon does not support emojis
	if (
		DriverService.supportsMastoApiV2(driver) ||
		DriverService.supportsAtProto(driver)
	)
		return <Fragment />;

	const ShownEmojis = AllEmojisExpanded
		? Emojis
		: Emojis.slice(0, EMOJI_COLLAPSED_COUNT_LIMIT);

	if (ShownEmojis.length === 0) return <View />;

	return (
		<View style={styles.emojiSectionContainer}>
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
						<NativeTextBold
							style={[
								styles.showAllEmojiButtonText,
								{ color: theme.textColor.medium },
							]}
						>
							{AllEmojisExpanded
								? 'Less'
								: `More (${Emojis.length - ShownEmojis.length})`}
						</NativeTextBold>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
}

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
	},
	emojiSectionContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: appDimensions.timelines.sectionBottomMargin,
		// extra spacing, since it needs to accept touch
		marginTop: 6,
	},
});

export default EmojiReactions;
