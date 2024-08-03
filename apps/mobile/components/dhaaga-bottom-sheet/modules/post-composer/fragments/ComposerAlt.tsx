import { memo, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	Image,
	TextInput,
	StyleSheet,
	Pressable,
} from 'react-native';
import {
	ComposeMediaTargetItem,
	useComposerContext,
} from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import useHookLoadingState from '../../../../../states/useHookLoadingState';

const ComposerAltListItem = memo(
	({ item, index }: { item: ComposeMediaTargetItem; index: number }) => {
		const { client } = useActivityPubRestClientContext();
		const { setAltText } = useComposerContext();
		const [TextContent, setTextContent] = useState(item.cw);
		const { forceUpdate } = useHookLoadingState();

		async function onSaveAltText() {
			if (TextContent === '') return;
			const { error } = await client.media.updateDescription(
				item.remoteId,
				TextContent,
			);
			if (!error) {
				setAltText(index, TextContent);
				forceUpdate();
			}
		}

		function onChange(text: string) {
			setTextContent(text);
		}

		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
						marginVertical: 4,
					}}
				>
					<View>
						<Image
							source={{ uri: item.previewUrl }}
							style={{ width: 64, height: 96, borderRadius: 8 }}
						/>
					</View>
					<View
						style={{
							width: '100%',
							height: '100%',
							marginLeft: 10,
							marginTop: 4,
						}}
					>
						<TextInput
							autoCapitalize={'none'}
							multiline={true}
							value={TextContent}
							placeholder={'Alt text for this image.'}
							placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
							style={styles.textInput}
							onChangeText={onChange}
						/>
						<View style={{ flexGrow: 1 }} />
						<Pressable
							style={{
								padding: 8,
								backgroundColor: '#404040',
								maxWidth: 72,
								borderRadius: 8,
								marginTop: 16,
								marginLeft: 4,
								display:
									TextContent === '' || item.cw === TextContent
										? 'none'
										: 'flex',
							}}
							onPress={onSaveAltText}
						>
							<Text
								style={{
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									textAlign: 'center',
									color: APP_FONT.MONTSERRAT_BODY,
								}}
							>
								Apply
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		);
	},
);

const ComposerAlt = memo(() => {
	const { mediaTargets } = useComposerContext();

	if (mediaTargets.length === 0)
		return (
			<View style={{ padding: 16 }}>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						textAlign: 'center',
						marginTop: 32,
					}}
				>
					You have not added any media attachments{' '}
				</Text>
			</View>
		);
	return (
		<View>
			<FlatList
				data={mediaTargets}
				renderItem={({ item, index }) => (
					<ComposerAltListItem item={item} index={index} />
				)}
				contentContainerStyle={{
					marginVertical: 16,
				}}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	},
});

export default ComposerAlt;
