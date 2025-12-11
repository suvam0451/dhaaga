import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';
import { CustomEmojiObjectType } from '@dhaaga/bridge';

type SelectedEmojiPreviewProps = {
	selection: CustomEmojiObjectType | null;
};

const SelectedEmojiPreview = memo(
	({ selection }: SelectedEmojiPreviewProps) => {
		const { theme } = useAppTheme();
		if (!selection) {
			return (
				<Text
					style={{
						flexGrow: 1,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						color: theme.secondary.a40,
						textAlign: 'center',
					}}
				>
					No reaction Selected
				</Text>
			);
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 8,
					justifyContent: 'center',
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image source={{ uri: selection.url }} style={styles.emojiContainer} />
				<Text
					style={[styles.emojiDesc, { color: theme.complementary.a0 }]}
					numberOfLines={1}
				>
					{selection.shortCode}
				</Text>
			</View>
		);
	},
);

const EMOJI_SIZE = 32;
const styles = StyleSheet.create({
	categoryLabel: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	emojiContainer: {
		width: EMOJI_SIZE,
		height: EMOJI_SIZE,
		borderRadius: 8,
		margin: 4,
	},
	textInput: {
		textDecorationLine: 'none',
		paddingVertical: 16,
		fontSize: 16,
		borderRadius: 8,
	},
	emojiDesc: {
		marginLeft: 4,
		flexShrink: 1,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default SelectedEmojiPreview;
