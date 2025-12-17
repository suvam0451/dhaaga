import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';
import { CustomEmojiObjectType } from '@dhaaga/bridge';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

type SelectedEmojiPreviewProps = {
	selection: CustomEmojiObjectType | null;
};

const SelectedEmojiPreview = memo(
	({ selection }: SelectedEmojiPreviewProps) => {
		const { theme } = useAppTheme();
		if (!selection) {
			return (
				<NativeTextNormal
					style={{
						flexGrow: 1,
						color: theme.secondary.a40,
						textAlign: 'center',
					}}
				>
					No reaction Selected
				</NativeTextNormal>
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
				<Image source={{ uri: selection.url }} style={styles.emojiContainer} />
				<NativeTextBold
					style={[styles.emojiDesc, { color: theme.complementary }]}
					numberOfLines={1}
				>
					{selection.shortCode}
				</NativeTextBold>
			</View>
		);
	},
);

const EMOJI_SIZE = 32;
const styles = StyleSheet.create({
	emojiContainer: {
		width: EMOJI_SIZE,
		height: EMOJI_SIZE,
		borderRadius: 8,
		margin: 4,
	},
	emojiDesc: {
		marginLeft: 4,
		flexShrink: 1,
		fontSize: 16,
	},
});

export default SelectedEmojiPreview;
