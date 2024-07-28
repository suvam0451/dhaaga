import { EmojiDto, styles } from './_shared.types';
import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import EmojiReactionImage from './EmojiReactionImage';
import { APP_FONTS } from '../../../../styles/AppFonts';

const EmojiReaction = memo(function Foo({ dto }: { dto: EmojiDto }) {
	if (dto.type === 'text') {
		return (
			<View style={styles.emojiContainer}>
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
			</View>
		);
	}

	if (dto.type === 'image') {
		return (
			<View style={styles.emojiContainer}>
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
			</View>
		);
	}

	return <View />;
});

export default EmojiReaction;
