import { memo, useMemo } from 'react';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Pressable, Text, View } from 'react-native';
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
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { AppIcon } from '../../../../lib/Icon';
import { DatetimeUtil } from '../../../../../utils/datetime.utils';
import { appDimensions } from '../../../../../styles/dimensions';
import { AppUserObject } from '../../../../../types/app-user.types';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../dhaaga-bottom-sheet/Core';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { LocalizationService } from '../../../../../services/localization.service';

type Props = {
	type: DhaagaJsNotificationType;
	handle: string;
	displayName: string;
	avatarUrl: string;
	id: string;
	extraData?: string;
	remoteSubdomain?: string;
	createdAt: Date | string;
};

const NOTIFICATION_TYPE_ICON_SIZE = 15;

/**
 * Pure Component
 */
export const NotificationSender = memo(
	({
		type,
		displayName,
		avatarUrl,
		extraData,
		remoteSubdomain,
		createdAt,
	}: Props) => {
		const { theme } = useAppTheme();

		// const { content: _displayName } = useMfm({
		// 	content: displayName,
		// 	remoteSubdomain,
		// 	emojiMap: new Map(),
		// 	deps: [displayName],
		// 	fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		// });

		const { find } = useAppCustomEmoji();
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
								color="white"
							/>
						),
						bg: '#34aed2',
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
									color={theme.secondary.a40}
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
									style={{ height: 18, width: 18 }}
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
			<View style={{ flexDirection: 'row', flex: 1 }}>
				<View style={styles.senderAvatarContainer}>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: avatarUrl,
						}}
						style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8 }}
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
				<View style={{ marginLeft: 12, flexGrow: 1 }}>
					<View
						style={{
							// maxWidth: '75%',
							overflow: 'hidden',
						}}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: theme.secondary.a10,
								maxWidth: '75%',
							}}
							numberOfLines={1}
						>
							{displayName}
						</Text>
					</View>

					<View
						style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_400_REGULAR,
								color: theme.complementary.a0,
							}}
						>
							{LocalizationService.notificationLabel(type)}
						</Text>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								color: theme.secondary.a40,
								fontSize: 13,
							}}
						>
							{' • '}
							{DatetimeUtil.timeAgo(createdAt)}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 'auto',
					}}
				>
					<AppIcon id={'ellipsis-v'} color={theme.secondary.a40} size={20} />
				</View>
			</View>
		);
	},
);

type InterfaceProps = {
	user: AppUserObject;
	type: DhaagaJsNotificationType;
	createdAt: Date | string;
	extraData?: string;
};

/**
 * Render the Sender interface using UserInterface
 * object (online usage)
 */
export const NotificationSenderInterface = memo(
	({ user, type, extraData, createdAt }: InterfaceProps) => {
		const { show } = useAppBottomSheet_Improved();

		const id = user.id;

		const displayName = user.displayName;
		const avatarUrl = user.avatarUrl;

		const handle = user.handle;

		/**
		 * NOTE: misskey acct objects do not
		 * contain enough information to populate
		 * the entire modal
		 */
		function onPress() {
			show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
		}

		return (
			<Pressable
				onPress={onPress}
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin,
					flex: 1,
				}}
			>
				<NotificationSender
					id={id}
					type={type}
					handle={handle}
					displayName={displayName}
					avatarUrl={avatarUrl}
					extraData={extraData}
					createdAt={createdAt}
				/>
			</Pressable>
		);
	},
);
