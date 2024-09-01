import { Fragment, memo, useState } from 'react';
import { Text, View } from 'react-native';
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
import { ActivityPubAppUserDtoType } from '../../../../../services/ap-proto/activitypub-user-dto.service';
import useMfm from '../../../../hooks/useMfm';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { AnimatedFlashList } from '@shopify/flash-list';

const ReactingUser = memo(({ dto }: { dto: ActivityPubAppUserDtoType }) => {
	const { content } = useMfm({
		content: dto.displayName,
		remoteSubdomain: dto.instance,
		emojiMap: new Map<string, EmojiMapValue>(),
		deps: [dto.displayName],
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		acceptTouch: false,
	});

	return (
		<View style={{ flexDirection: 'row', marginVertical: 4 }}>
			<View style={{ borderWidth: 1.5, borderColor: '#888', borderRadius: 8 }}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: dto.avatarUrl }}
					style={{ width: 48, height: 48, borderRadius: 6 }}
				/>
			</View>
			<View style={{ marginLeft: 6 }}>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_HEADER,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					{content}
				</Text>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						fontSize: 13,
					}}
				>
					{dto.handle}
				</Text>
			</View>
		</View>
	);
});

const ReactionDetailsBottomSheet = memo(() => {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const { TextRef, PostRef, timelineDataPostListReducer, setVisible, visible } =
		useAppBottomSheet();
	const { Data, fetchStatus } = useGetReactionDetails(
		PostRef.current?.id,
		TextRef.current,
	);

	const IS_REMOTE = ActivitypubReactionsService.canReact(Data?.id);

	const [Loading, setLoading] = useState(false);
	async function onActionPress() {
		setLoading(true);
		const { id } = ActivitypubReactionsService.extractReactionCode(
			TextRef.current,
			domain,
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

	/**
	 * Since animations with the flash list
	 * open are slow af
	 */

	if (fetchStatus !== 'idle')
		return (
			<View style={{ alignItems: 'center', marginTop: 32 }}>
				<Text
					style={{
						fontSize: 24,
						color: APP_FONT.MONTSERRAT_BODY,
						textAlign: 'center',
					}}
				>
					Loading...
				</Text>
			</View>
		);
	if (!Data || !visible) return <View />;

	return (
		<View style={{ padding: 8, paddingTop: 16, flex: 1 }}>
			<View style={{ flexDirection: 'row' }}>
				{/*@ts-ignore-next-line*/}
				<Image source={{ uri: Data.url }} style={{ width: 32, height: 32 }} />
				<View
					style={{
						flexGrow: 1,
						justifyContent: 'center',
						marginLeft: 8,
						flex: 1,
					}}
				>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,

							flexShrink: 1,
						}}
						numberOfLines={1}
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
					disabled={IS_REMOTE}
					label={Data.reacted ? 'Remove' : 'Add'}
				/>
			</View>
			<View
				style={{
					flex: 1,
					flexGrow: 1,
					// backgroundColor: 'red',
				}}
			>
				<AnimatedFlashList
					renderItem={({ item }) => <ReactingUser dto={item} />}
					estimatedItemSize={32}
					data={Data.accounts}
					ListHeaderComponent={
						<Fragment>
							{IS_REMOTE && (
								<View>
									<Text
										style={{
											color: APP_FONT.MONTSERRAT_BODY,
											fontFamily: APP_FONTS.INTER_500_MEDIUM,
											marginTop: 8,
										}}
									>
										You cannot add this reaction,{'\n'}since it is not from your
										instance.
									</Text>
								</View>
							)}

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
						</Fragment>
					}
					contentContainerStyle={
						{
							// paddingBottom: 50,
						}
					}
					// ListFooterComponent={<View style={{ height: 200 }} />}
				/>
			</View>
		</View>
	);
});

export default ReactionDetailsBottomSheet;
