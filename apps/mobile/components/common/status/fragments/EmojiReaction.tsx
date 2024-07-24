import { EmojiDto, styles } from './_shared.types';
import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import EmojiReactionImage from './EmojiReactionImage';

const EmojiReaction = memo(function Foo({ dto }: { dto: EmojiDto }) {
	if (dto.type === 'text') {
		return (
			<View style={styles.emojiContainer}>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_HEADER,
						fontSize: 18,
					}}
				>
					{dto.name}
				</Text>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_HEADER,
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
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_HEADER,
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
