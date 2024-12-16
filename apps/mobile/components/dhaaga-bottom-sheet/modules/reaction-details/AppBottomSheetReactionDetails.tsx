import { Fragment, memo, useState } from 'react';
import { Text, View } from 'react-native';
import { useAppBottomSheet } from '../_api/useAppBottomSheet';
import useGetReactionDetails from '../../../../hooks/api/useGetReactionDetails';
import { Image } from 'expo-image';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import {
	APP_BOTTOM_SHEET_ACTION_CATEGORY,
	AppButtonBottomSheetAction,
} from '../../../lib/Buttons';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../common/timeline/api/postArrayReducer';
import useMfm from '../../../hooks/useMfm';
import { AnimatedFlashList } from '@shopify/flash-list';
import ActivitypubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import ActivityPubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import { AppUser } from '../../../../services/approto/app-user-service';
import { AppAvatar } from '../../../lib/Avatar';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const ReactingUser = memo(({ dto }: { dto: AppUser }) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { content } = useMfm({
		content: dto.displayName,
		remoteSubdomain: dto.instance,
		emojiMap: new Map<string, string>(),
		deps: [dto.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		acceptTouch: false,
		emphasis: 'high',
	});

	return (
		<View style={{ flexDirection: 'row', marginVertical: 4 }}>
			<AppAvatar uri={dto.avatarUrl} />
			<View style={{ marginLeft: 6, justifyContent: 'center' }}>
				<View>{content}</View>
				<Text
					style={{
						color: theme.textColor.medium,
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

const AppBottomSheetReactionDetails = memo(() => {
	const { client, driver, acct, theme } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
			client: o.router,
			theme: o.colorScheme,
		})),
	);
	const { TextRef, PostRef, timelineDataPostListReducer, setVisible, visible } =
		useAppBottomSheet();
	const { Data, fetchStatus } = useGetReactionDetails(
		PostRef.current?.id,
		TextRef.current,
	);

	const IS_REMOTE = ActivitypubReactionsService.canReact(Data?.id);

	const [Loading, setLoading] = useState(false);

	async function onActionPress() {
		if (IS_REMOTE) return;

		setLoading(true);
		const { id } = ActivitypubReactionsService.extractReactionCode(
			TextRef.current,
			driver,
			acct?.server,
		);

		const state = Data.reacted
			? await ActivityPubReactionsService.removeReaction(
					client,
					PostRef.current.id,
					id,
					driver,
					setLoading,
				)
			: await ActivityPubReactionsService.addReaction(
					client,
					PostRef.current.id,
					TextRef.current,
					driver,
					setLoading,
				);

		// request reducer to update reaction state
		if (state === null) return;
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
							color={IS_REMOTE ? APP_FONT.DISABLED : APP_FONT.MONTSERRAT_BODY}
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
											color: theme.textColor.medium,
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
									color: theme.textColor.medium,
									marginVertical: 16,
								}}
							>
								Reacted By {Data.count} users:
							</Text>
						</Fragment>
					}
				/>
			</View>
		</View>
	);
});

export default AppBottomSheetReactionDetails;
