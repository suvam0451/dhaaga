import { Fragment, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import useGetReactionDetails from '#/hooks/api/useGetReactionDetails';
import { Image } from 'expo-image';
import { APP_FONT } from '#/styles/AppTheme';
import { FontAwesome } from '@expo/vector-icons';
import { ActivityPubReactionsService } from '@dhaaga/bridge';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';

import type { UserObjectType } from '@dhaaga/bridge';
import { AppAvatar } from '#/components/lib/Avatar';
import {
	APP_BOTTOM_SHEET_ACTION_CATEGORY,
	AppButtonBottomSheetAction,
} from '#/components/lib/Buttons';
import TextAstRendererView from '#/ui/TextAstRendererView';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

function ReactingUser({ dto }: { dto: UserObjectType }) {
	const { theme } = useAppTheme();

	return (
		<View style={{ flexDirection: 'row', marginVertical: 4 }}>
			<AppAvatar uri={dto.avatarUrl} />
			<View style={{ marginLeft: 6, justifyContent: 'center' }}>
				<TextAstRendererView
					tree={dto.parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={dto.calculated.emojis}
				/>
				<NativeTextNormal
					style={{
						color: theme.secondary.a30,
						fontSize: 13,
					}}
				>
					{dto.handle}
				</NativeTextNormal>
			</View>
		</View>
	);
}

function ShowReactionDetailsBottomSheet() {
	const { theme } = useAppTheme();
	const { client, driver } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const { Data, fetchStatus } = useGetReactionDetails(null, null);
	const { visible, hide } = useAppBottomSheet();

	const IS_REMOTE = ActivityPubReactionsService.cannotReact(Data?.id);

	const [Loading, setLoading] = useState(false);

	async function onActionPress() {
		if (IS_REMOTE) return;

		setLoading(true);
		const { id } = ActivityPubReactionsService.extractReactionCode(
			null,
			driver,
			acct?.server,
		);

		const state = Data.reacted
			? await ActivityPubReactionsService.removeReaction(
					client,
					null,
					id,
					driver,
					setLoading,
				)
			: await ActivityPubReactionsService.addReaction(
					client,
					null,
					null,
					driver,
					setLoading,
				);

		// request reducer to update reaction state
		if (state === null) return;
		hide();
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
				<Image source={{ uri: Data.url }} style={{ width: 32, height: 32 }} />
				<View
					style={{
						flexGrow: 1,
						justifyContent: 'center',
						marginLeft: 8,
						flex: 1,
					}}
				>
					<NativeTextBold
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							flexShrink: 1,
						}}
						numberOfLines={1}
					>
						{Data.id}
					</NativeTextBold>
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
				<FlatList
					renderItem={({ item }) => <ReactingUser dto={item} />}
					data={Data.accounts}
					ListHeaderComponent={
						<Fragment>
							{IS_REMOTE && (
								<View>
									<NativeTextBold
										style={{
											color: theme.secondary.a30,
											marginTop: 8,
										}}
									>
										You cannot add this reaction,{'\n'}since it is not from your
										instance.
									</NativeTextBold>
								</View>
							)}

							<NativeTextBold
								style={{
									fontSize: 16,
									color: theme.secondary.a30,
									marginVertical: 16,
								}}
							>
								Reacted By {Data.count} users:
							</NativeTextBold>
						</Fragment>
					}
				/>
			</View>
		</View>
	);
}

export default ShowReactionDetailsBottomSheet;
