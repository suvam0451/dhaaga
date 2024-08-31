import { memo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import useGetReactionDetails from '../../../../../hooks/api/useGetReactionDetails';
import { Image } from 'expo-image';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import ActivitypubReactionsService from '../../../../../services/ap-proto/activitypub-reactions.service';
import ActivityPubReactionsService from '../../../../../services/ap-proto/activitypub-reactions.service';
import {
	APP_BOTTOM_SHEET_ACTION_CATEGORY,
	AppButtonBottomSheetAction,
} from '../../../../lib/Buttons';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';

const ReactionDetailsBottomSheet = memo(() => {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const { TextRef, PostRef, timelineDataPostListReducer, setVisible } =
		useAppBottomSheet();
	const { Data } = useGetReactionDetails(PostRef.current?.id, TextRef.current);

	const [Loading, setLoading] = useState(false);
	async function onActionPress() {
		setLoading(true);
		const { id } = ActivitypubReactionsService.extractReactionCode(
			TextRef.current,
			subdomain,
		);

		const state = Data.reacted
			? await ActivityPubReactionsService.removeReaction(
					client,
					PostRef.current.id,
					id,
					domain,
					setLoading,
				)
			: await ActivityPubReactionsService.addReaction(
					client,
					PostRef.current.id,
					TextRef.current,
					domain,
					setLoading,
				);
		// request reducer to update reaction state
		if (!state) return;
		timelineDataPostListReducer.current({
			type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_REACTION_STATE,
			payload: {
				id: PostRef.current.id,
				state,
			},
		});
		setVisible(false);
	}

	if (!Data) return <View />;
	return (
		<View style={{ padding: 8, paddingTop: 16 }}>
			<View style={{ flexDirection: 'row' }}>
				{/*@ts-ignore-next-line*/}
				<Image source={{ uri: Data.url }} style={{ width: 32, height: 32 }} />
				<View style={{ flexGrow: 1, justifyContent: 'center', marginLeft: 8 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{Data.id}
					</Text>
				</View>

				<AppButtonBottomSheetAction
					onPress={onActionPress}
					Icon={
						<FontAwesome
							name="send"
							size={20}
							style={{ marginLeft: 8 }}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					}
					loading={Loading}
					type={
						Data.reacted
							? APP_BOTTOM_SHEET_ACTION_CATEGORY.CANCEL
							: APP_BOTTOM_SHEET_ACTION_CATEGORY.PROGRESS
					}
					disabled={false}
					label={Data.reacted ? 'Remove' : 'Add'}
				/>
			</View>

			<Text
				style={{
					fontSize: 16,
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					color: APP_FONT.MONTSERRAT_BODY,
					marginVertical: 16,
				}}
			>
				Reacted By {Data.count} users:
			</Text>
			<FlatList
				data={Data.accounts}
				renderItem={({ item }) => (
					<View style={{ flexDirection: 'row' }}>
						<View
							style={{ borderWidth: 1.5, borderColor: '#888', borderRadius: 8 }}
						>
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: item.avatarUrl }}
								style={{ width: 48, height: 48 }}
							/>
						</View>
						<View style={{ marginLeft: 6 }}>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_HEADER,
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								}}
							>
								{item.displayName}
							</Text>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_BODY,
									fontFamily: APP_FONTS.INTER_500_MEDIUM,
								}}
							>
								{item.handle}
							</Text>
						</View>
					</View>
				)}
			/>
		</View>
	);
});

export default ReactionDetailsBottomSheet;
