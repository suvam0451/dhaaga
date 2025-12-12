import {
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import WithAppStatusItemContext from '../../containers/contexts/WithPostItemContext';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';
import { APP_FONTS } from '#/styles/AppFonts';

function AuthoredPostPreviewBottomSheet() {
	const { ctx, stateId } = useAppBottomSheet();
	const { postEventBus } = useAppPublishers();
	const [Post, setPost] = useState(null);
	const { theme } = useAppTheme();

	function onUpdate({ uuid }: { uuid: string }) {
		setPost(postEventBus.read(uuid));
	}

	useEffect(() => {
		if (ctx.$type !== 'post-preview') return;
		const postId = ctx.postId;
		onUpdate({ uuid: postId });
		postEventBus.subscribe(postId, onUpdate);
		return () => {
			postEventBus.unsubscribe(postId, onUpdate);
		};
	}, [stateId]);

	return (
		<ScrollView
			contentContainerStyle={{ paddingHorizontal: 10, marginVertical: 32 }}
		>
			<View
				style={{
					flexDirection: 'row',
					flex: 1,
					alignItems: 'center',
					marginBottom: 32,
				}}
			>
				<Text
					style={{
						color: theme.secondary.a10,
						fontSize: 20,
						fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
						marginLeft: 4,
						flex: 1,
					}}
				>
					Published 🎉
				</Text>
				{/*<TouchableOpacity*/}
				{/*	style={[*/}
				{/*		styles.buttonContainer,*/}
				{/*		{*/}
				{/*			backgroundColor: theme.complementary,*/}
				{/*		},*/}
				{/*	]}*/}
				{/*	onPress={onBrowsePress}*/}
				{/*>*/}
				{/*	<Text*/}
				{/*		style={{*/}
				{/*			color: 'black',*/}
				{/*			fontFamily: APP_FONTS.INTER_600_SEMIBOLD,*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		Browse*/}
				{/*	</Text>*/}
				{/*	<FontAwesome*/}
				{/*		name="send"*/}
				{/*		size={20}*/}
				{/*		style={{ marginLeft: 8 }}*/}
				{/*		color={'black'}*/}
				{/*	/>*/}
				{/*</TouchableOpacity>*/}
			</View>
			<WithAppStatusItemContext dto={Post}>
				<PostTimelineEntryView isPreview />
			</WithAppStatusItemContext>

			<View style={{ marginTop: 36 }}>
				<Text
					style={{
						color: theme.secondary.a30,
						fontSize: 14,
						textAlign: 'center',
					}}
				>
					More options (Deletion, Re-draft etc.) will be implemented later.
				</Text>
			</View>
		</ScrollView>
	);
}

export default AuthoredPostPreviewBottomSheet;
