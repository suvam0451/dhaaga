import { EmojiDto, styles } from './_shared.types';
import { useMemo, useState } from 'react';
import {
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	Pressable,
} from 'react-native';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '#/styles/AppFonts';
import { ActivityPubReactionsService } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppPublishers, useAppTheme } from '#/states/global/hooks';
import { Loader } from '#/components/lib/Loader';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';

function EmojiReaction({ dto }: { dto: EmojiDto; postDto: PostObjectType }) {
	const { dto: postItem } = withPostItemContext();

	// TODO: use this to show loading animation in place
	const [EmojiStateLoading, setEmojiStateLoading] = useState(false);
	const { theme } = useAppTheme();
	const { postObjectActions } = useAppPublishers();

	const CONTAINER_STYLE = useMemo(() => {
		if (dto.interactable) {
			if (dto.me) {
				return [
					styles.emojiContainer,
					{
						backgroundColor: theme.reactions.active,
						borderWidth: 2,
						borderColor: theme.primary,
					},
				];
			} else {
				return [
					styles.emojiContainer,
					{ backgroundColor: theme.reactions.active },
				];
			}
		}
		return [
			styles.emojiContainer,
			{ backgroundColor: theme.reactions.inactive },
		];
	}, [dto.interactable, dto.me, theme]);

	async function onReactionPress() {
		// nothing to do on short press for remote emojis
		if (ActivityPubReactionsService.cannotReact(dto?.name)) {
			console.log('cannot react???');
			return;
		}
		await postObjectActions.toggleReaction(
			postItem.uuid,
			dto,
			setEmojiStateLoading,
		);

		// FIXME: bring back quick reaction settings
	}

	function onReactionLongPress() {
		return;
	}

	if (EmojiStateLoading) return <Loader />;
	if (dto.type === 'text') {
		return (
			<TouchableOpacity style={CONTAINER_STYLE} onPress={onReactionPress}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						// unicode emojis detected
						color:
							dto.name.length < 3 ? theme.secondary.a10 : theme.secondary.a30,
						fontSize: 14,
					}}
				>
					{dto.name}
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						color: theme.secondary.a10,
						marginLeft: 8,
					}}
				>
					{dto.count}
				</Text>
			</TouchableOpacity>
		);
	}

	if (dto.type === 'image') {
		return (
			<Pressable
				style={[localStyles.imageReactionContainer, CONTAINER_STYLE]}
				onPress={onReactionPress}
				onLongPress={onReactionLongPress}
			>
				<EmojiReactionImage
					url={dto.url}
					height={dto.height}
					width={dto.width}
				/>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						color: theme.secondary.a10,
						marginLeft: 8,
					}}
				>
					{dto.count}
				</Text>
			</Pressable>
		);
	}

	return <View />;
}

export default EmojiReaction;

const localStyles = StyleSheet.create({
	imageReactionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 8,
	},
});
