import { memo, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TextInput,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from 'react-native';
import {
	ComposeMediaTargetItem,
	useComposerContext,
} from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import useHookLoadingState from '../../../../../states/useHookLoadingState';
import { Image } from 'expo-image';

const ComposerAltListItem = memo(
	({ item, index }: { item: ComposeMediaTargetItem; index: number }) => {
		const { client } = useActivityPubRestClientContext();
		const { setAltText } = useComposerContext();
		const [TextContent, setTextContent] = useState(item.cw);
		const { forceUpdate } = useHookLoadingState();

		async function onSaveAltText() {
			if (TextContent === '') return;
			try {
				const { data, error } = await client.media.updateDescription(
					item.remoteId,
					TextContent,
				);
				// console.log('[INFO]: alt-text update result', data, error);
				if (!error) {
					setAltText(index, TextContent);
					forceUpdate();
				}
			} catch (e) {
				console.log('[ERROR]: updating alt-text', e);
			}
		}

		function onChange(text: string) {
			setTextContent(text);
		}

		// console.log(item.previewUrl || item.localUri);
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
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: item.previewUrl || item.localUri }}
							style={{ width: 64, height: 96, borderRadius: 8 }}
						/>
					</View>
					<View
						style={{
							// width: '100%',
							// height: '100%',
							marginLeft: 10,
							marginTop: 4,
							flex: 1,
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
						<TouchableOpacity
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
								// flex: 1,
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
						</TouchableOpacity>
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
		// backgroundColor: 'red',
		width: '100%',
	},
});

export default ComposerAlt;
