import { EmojiDto, styles } from './_shared.types';
import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';

const EmojiReaction = memo(function Foo({
	dto,
	postDto,
}: {
	dto: EmojiDto;
	postDto: ActivityPubStatusAppDtoType;
}) {
	const { TextRef, PostRef, setType, setVisible } = useAppBottomSheet();

	const CONTAINER_STYLE = useMemo(() => {
		if (dto.interactable) {
			if (dto.me) {
				return [
					styles.emojiContainer,
					{
						backgroundColor: '#41332e',
						borderWidth: 2,
						borderColor: '#d3ac6c',
					},
				];
			} else {
				return [styles.emojiContainer, { backgroundColor: '#303030' }];
			}
		}
		return [styles.emojiContainer, { backgroundColor: '#161616' }];
	}, [dto.interactable, dto.me]);

	function onReactionPress() {
		TextRef.current = dto.name;
		PostRef.current = postDto;
		setType(APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS);
		setVisible(true);
	}

	if (dto.type === 'text') {
		return (
			<TouchableOpacity style={CONTAINER_STYLE} onPress={onReactionPress}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color:
							dto.name.length < 3
								? APP_FONT.MONTSERRAT_HEADER
								: APP_FONT.MONTSERRAT_BODY,
						fontSize: 14,
					}}
				>
					{dto.name}
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
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
			<TouchableOpacity style={CONTAINER_STYLE} onPress={onReactionPress}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 8,
					}}
				>
					<EmojiReactionImage
						url={dto.url}
						height={dto.height}
						width={dto.width}
					/>
					<View>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								marginLeft: 8,
							}}
						>
							{dto.count}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return <View />;
});

export default EmojiReaction;
