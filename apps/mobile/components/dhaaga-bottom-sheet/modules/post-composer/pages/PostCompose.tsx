import { Fragment, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import ComposerTextInput from '../fragments/ComposerText';
import ComposerSpoiler from '../fragments/ComposerSpoiler';
import { useComposerContext } from '../api/useComposerContext';
import ComposerAlt from '../fragments/ComposerAlt';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import ComposerTopMenu from '../fragments/ComposerTopMenu';
import TextEditorService from '../../../../../services/text-editor.service';
import {
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { Emoji } from '../../emoji-picker/emojiPickerReducer';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import ComposerAutoCompletion from '../fragments/ComposerAutoCompletion';
import { Ionicons } from '@expo/vector-icons';
import VisibilityPicker from '../fragments/VisibilityPicker';
import { AppIcon } from '../../../../lib/Icon';

const ICON_SIZE = 26;

/**
 * Options to add extra stuff to a post
 *
 * - TXT mode: cw,
 */
function ActionButtons() {
	const { theme } = useAppTheme();
	const { state, dispatch } = useComposerContext();

	function toggleCwShown() {
		dispatch({
			type: PostComposerReducerActionType.TOGGLE_CW_SECTION_SHOWN,
		});
	}

	function onCustomEmojiClicked() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_EMOJI_TAB,
		});
	}

	function onToggleMediaButton() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_MEDIA_TAB,
		});
	}

	return (
		<Fragment>
			<ComposerAutoCompletion />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<View style={{ flexDirection: 'row', flex: 1 }}>
					<AppIcon
						id={'images'}
						containerStyle={{
							paddingHorizontal: 6,
							// paddingVertical: 8,
						}}
						size={ICON_SIZE}
						color={theme.secondary.a20}
						onPress={onToggleMediaButton}
					/>
					<Pressable style={{ paddingHorizontal: 6 }} onPress={toggleCwShown}>
						<Ionicons
							name="warning"
							size={ICON_SIZE}
							color={
								state.cw === '' ? theme.secondary.a20 : theme.complementary.a0
							}
						/>
					</Pressable>
					<Pressable
						style={{
							paddingHorizontal: 6,
						}}
						onPress={onCustomEmojiClicked}
					>
						<Ionicons
							name={'happy'}
							size={ICON_SIZE}
							color={theme.secondary.a20}
						/>
					</Pressable>
				</View>
				<VisibilityPicker />
			</View>
		</Fragment>
	);
}

function PostCompose() {
	const { visible, ctx, stateId } = useAppBottomSheet_Improved();
	const { state, dispatch } = useComposerContext();
	const { theme } = useAppTheme();
	const { postPub } = useAppPublishers();

	useEffect(() => {
		if (!visible) return;
		if (ctx.uuid && postPub.readCache(ctx.uuid)) {
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: postPub.readCache(ctx.uuid),
				},
			});
		} else {
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: null,
				},
			});
		}
	}, [stateId, ctx, visible]);

	function onEmojiApplied(o: Emoji) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.addReactionText(state.text, o.shortCode),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	function onCancelFromAuxTab() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	const EditorContent = useMemo(() => {
		switch (state.mode) {
			case 'txt': {
				return (
					<View style={{ height: '100%' }}>
						<ScrollView style={{ flex: 1 }}>
							<ComposerTopMenu />
							<ComposerSpoiler />
							<ComposerTextInput />
							<View style={{ flexGrow: 1 }} />
						</ScrollView>
						<View style={{ paddingBottom: 16 }}>
							<ActionButtons />
						</View>
					</View>
				);
			}
			case 'emoji':
				return (
					<EmojiPickerBottomSheet
						onAccept={onEmojiApplied}
						onCancel={onCancelFromAuxTab}
					/>
				);
			case 'media': {
				return <ComposerAlt />;
			}
		}
	}, [state.mode, theme]);

	return (
		<View
			style={[
				styles.bottomSheetContentContainer,
				{
					display: visible ? 'flex' : 'none',
					backgroundColor: theme.palette.menubar,
				},
			]}
		>
			{/*This section changes based on edit mode*/}
			{EditorContent}
		</View>
	);
}

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		paddingHorizontal: 10,
		paddingTop: 0,
		height: '100%',
	},
});

export default PostCompose;
