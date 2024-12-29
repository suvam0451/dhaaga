import { memo, useCallback, useMemo } from 'react';
import { ActivitypubHelper, DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ICON_SIZE, styles } from '../segments/_common';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import useAppCustomEmoji from '../../../../../hooks/app/useAppCustomEmoji';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppBottomSheet } from '../../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../states/_global';
import { DatetimeUtil } from '../../../../../utils/datetime.utils';
import { AppUserObject } from '../../../../../types/app-user.types';

type Props = {
	type: DhaagaJsNotificationType;
	handle: string;
	displayName: string;
	avatarUrl: string;
	id: string;
	extraData?: string;
	remoteSubdomain?: string;
	createdAt: Date;
};

const NOTIFICATION_TYPE_ICON_SIZE = 15;

/**
 * Pure Component
 */
export const NotificationSenderMini = memo(
	({
		type,
		displayName,
		avatarUrl,
		extraData,
		remoteSubdomain,
		createdAt,
	}: Props) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		const { find } = useAppCustomEmoji();
		const TextContent = useMemo(() => {
			switch (type) {
				case DhaagaJsNotificationType.FAVOURITE: {
					return 'Liked your post';
				}
				case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
					return 'Accepted your follow request';
				}
				case DhaagaJsNotificationType.FOLLOW: {
					return 'Followed You';
				}
				case DhaagaJsNotificationType.REBLOG:
				case DhaagaJsNotificationType.RENOTE: {
					return 'Boosted your post';
				}
				case DhaagaJsNotificationType.REACTION: {
					return 'Reacted to your post';
				}
				case DhaagaJsNotificationType.STATUS: {
					return 'Posted';
				}
				case DhaagaJsNotificationType.REPLY: {
					return 'Replied to your post';
				}
				case DhaagaJsNotificationType.MENTION: {
					return 'Mentioned you in a post';
				}
			}
		}, [type]);

		const { Icon, bg } = useMemo(() => {
			switch (type) {
				case DhaagaJsNotificationType.FAVOURITE: {
					return {
						// Icon: <FontAwesome name="star" size={16} color={'#feac33'} />,
						Icon: (
							<AntDesign
								name="like1"
								size={NOTIFICATION_TYPE_ICON_SIZE}
								color="#feac33"
							/>
						),
						bg: '#1f1f1f',
					};
				}
				case DhaagaJsNotificationType.REBLOG:
				case DhaagaJsNotificationType.RENOTE: {
					return {
						Icon: (
							<Ionicons
								name={'rocket-outline'}
								color={'white'}
								size={NOTIFICATION_TYPE_ICON_SIZE}
							/>
						),
						bg: '#34d299',
					};
				}
				case DhaagaJsNotificationType.FOLLOW: {
					return {
						Icon: (
							<MaterialIcons
								name="waving-hand"
								size={NOTIFICATION_TYPE_ICON_SIZE}
								color={APP_FONT.MONTSERRAT_HEADER}
								style={{ opacity: 0.75 }}
							/>
						),
						bg: '#1a5465',
					};
				}
				case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
					return {
						Icon: (
							<Feather
								name="check-square"
								size={NOTIFICATION_TYPE_ICON_SIZE}
								color="white"
							/>
						),
						bg: '#34aed2',
					};
				}
				case DhaagaJsNotificationType.REACTION: {
					// example input --> :example@misskey.io:
					const localEmojiRegex = /:(.*?):/;
					const remoteEmojiRegex = /:(.*?)@(.*?):/;

					let data = extraData;
					if (remoteEmojiRegex.test(extraData)) {
						const match = remoteEmojiRegex.exec(extraData);
						data = find(match[1], remoteSubdomain);
					} else if (localEmojiRegex.test(extraData)) {
						const match = localEmojiRegex.exec(extraData);
						data = find(match[1], match[2]);
					}

					if (!data) {
						return {
							Icon: (
								<FontAwesome6
									name="question-circle"
									size={16}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							),
							bg: '#242424',
						};
						// console.log('[WARN]: failed to resolve emoji', extraData);
						// data = extraData;
					}

					if (data?.length < 5) {
						return {
							Icon: <Text>{data}</Text>,
							bg: '#242424',
						};
					} else {
						return {
							Icon: (
								// @ts-ignore-next-line
								<Image
									source={{ uri: data }}
									style={{ height: 18, width: 18, opacity: 0.87 }}
								/>
							),
							bg: '#242424',
						};
					}
				}
				case DhaagaJsNotificationType.REPLY:
				case DhaagaJsNotificationType.MENTION: {
					return {
						Icon: (
							<Octicons
								name="mention"
								size={16}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						),
						bg: 'purple',
					};
				}
				case DhaagaJsNotificationType.STATUS: {
					return {
						Icon: (
							<FontAwesome6
								name="rss"
								size={14}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						),
						bg: 'purple',
					};
				}
				default: {
					return {
						Icon: <Octicons name="mention" size={24} color="black" />,
						bg: '#1f1f1f',
					};
				}
			}
		}, [type, extraData]);

		return (
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.senderAvatarContainer}>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: avatarUrl,
						}}
						style={{
							width: ICON_SIZE,
							height: ICON_SIZE,
							borderRadius: 8,
							opacity: 0.87,
						}}
					/>
					<View
						style={[
							styles.notificationCategoryIconContainer,
							{ backgroundColor: bg || '#1f1f1f' },
						]}
					>
						{Icon}
					</View>
				</View>
				<View style={{ marginLeft: 12 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
						numberOfLines={1}
					>
						{displayName}
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								color: theme.complementary.a0,
								fontSize: 14,
							}}
						>
							{TextContent}
						</Text>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 12,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							}}
						>
							{DatetimeUtil.timeAgo(createdAt)}
						</Text>
					</View>
				</View>
			</View>
		);
	},
);

type InterfaceProps = {
	acct: AppUserObject;
	type: DhaagaJsNotificationType;
	createdAt: Date;
	extraData?: string;
};

/**
 * Render the Sender interface using UserInterface
 * object (online usage)
 */
export const NotificationSenderMiniInterface = memo(
	({ acct, type, extraData, createdAt }: InterfaceProps) => {
		const { driver, acct: acctItem } = useGlobalState(
			useShallow((o) => ({
				driver: o.driver,
				acct: o.acct,
			})),
		);

		const id = acct.id;

		const acctUrl = acct.handle;
		const displayName = acct.displayName;
		const avatarUrl = acct.avatarUrl;

		const handle = useMemo(() => {
			return ActivitypubHelper.getHandle(acctUrl, acctItem?.server);
		}, [acctUrl]);

		const { setType, updateRequestId, UserRef, UserIdRef } =
			useAppBottomSheet();

		/**
		 * NOTE: misskey acct objects do not
		 * contain enough information to populate
		 * the entire modal
		 *
		 * FIXME: profile peek from notifications
		 */
		const onPress = useCallback(() => {
			if (driver === KNOWN_SOFTWARE.MASTODON) {
				// forward existing ref
				// UserRef.current = acct;
				// UserIdRef.current = acct.getId();
			} else {
				// request info be fetched
				// UserRef.current = null;
				// UserIdRef.current = acct.getId();
			}
			// setType(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK);
			// setVisible(true);
			// updateRequestId();
		}, [acct, driver, UserRef, UserIdRef, updateRequestId, setType]);

		return (
			<TouchableOpacity onPress={onPress}>
				<NotificationSenderMini
					id={id}
					type={type}
					handle={handle}
					displayName={displayName}
					avatarUrl={avatarUrl}
					extraData={extraData}
					createdAt={createdAt}
				/>
			</TouchableOpacity>
		);
	},
);
