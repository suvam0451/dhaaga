import { Fragment, useState } from 'react';
import { Text, View } from 'react-native';
import useGetReactionDetails from '../../../../hooks/api/useGetReactionDetails';
import { Image } from 'expo-image';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import {
	APP_BOTTOM_SHEET_ACTION_CATEGORY,
	AppButtonBottomSheetAction,
} from '../../../lib/Buttons';
import useMfm from '../../../hooks/useMfm';
import { AnimatedFlashList } from '@shopify/flash-list';
import ActivitypubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import ActivityPubReactionsService from '../../../../services/approto/activitypub-reactions.service';
import { AppAvatar } from '../../../lib/Avatar';
import { AppUserObject } from '../../../../types/app-user.types';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';

function ReactingUser({ dto }: { dto: AppUserObject }) {
	const { theme } = useAppTheme();
	const { content } = useMfm({
		content: dto.displayName,
		emojiMap: new Map<string, string>(),
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		acceptTouch: false,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A20,
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
}

function AppBottomSheetReactionDetails() {
	const { theme } = useAppTheme();
	const { client, driver } = useAppApiClient();
	const { acct } = useAppAcct();
	const { Data, fetchStatus } = useGetReactionDetails(null, null);
	const { visible, hide } = useAppBottomSheet();

	const IS_REMOTE = ActivitypubReactionsService.cannotReact(Data?.id);

	const [Loading, setLoading] = useState(false);

	async function onActionPress() {
		if (IS_REMOTE) return;

		setLoading(true);
		const { id } = ActivitypubReactionsService.extractReactionCode(
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
}

export default AppBottomSheetReactionDetails;
