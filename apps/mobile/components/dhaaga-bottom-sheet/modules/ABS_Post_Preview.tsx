import {
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import StatusItem from '../../common/status/StatusItem';
import { APP_FONTS } from '../../../styles/AppFonts';
import useAppNavigator from '../../../states/useAppNavigator';

function ABS_Post_Preview() {
	const { ctx, stateId, hide } = useAppBottomSheet();
	const { toPost } = useAppNavigator();
	const { postPub } = useAppPublishers();
	const [Post, setPost] = useState(postPub.readCache(ctx?.uuid));
	const { theme } = useAppTheme();

	function onUpdate({ uuid }: { uuid: string }) {
		setPost(postPub.readCache(uuid));
	}

	useEffect(() => {
		onUpdate({ uuid: ctx.uuid });
		postPub.subscribe(ctx.uuid, onUpdate);
		return () => {
			postPub.unsubscribe(ctx.uuid, onUpdate);
		};
	}, [ctx, stateId]);

	function onBrowsePress() {
		toPost(Post.id);
		hide();
	}

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
				{/*			backgroundColor: theme.complementary.a0,*/}
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
				<StatusItem isPreview />
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

export default ABS_Post_Preview;

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		borderRadius: 8,
		paddingVertical: 8,
		maxHeight: 36,
	},
});
