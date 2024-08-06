import { memo, useMemo } from 'react';
import {
	ActivitypubHelper,
	DhaagaJsNotificationType,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ICON_SIZE, styles } from '../segments/_common';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import useAppCustomEmoji from '../../../../../hooks/app/useAppCustomEmoji';

type Props = {
	type: DhaagaJsNotificationType;
	handle: string;
	displayName: string;
	avatarUrl: string;
	id: string;
	extraData?: string;
	remoteSubdomain?: string;
};

const NOTIFICATION_TYPE_ICON_SIZE = 15;

/**
 * Pure Component
 */
export const NotificationSender = memo(
	({
		id,
		type,
		handle,
		displayName,
		avatarUrl,
		extraData,
		remoteSubdomain,
	}: Props) => {
		const { find } = useAppCustomEmoji();
		const { Icon, bg } = useMemo(() => {
			switch (type) {
				case DhaagaJsNotificationType.FAVOURITE: {
					return {
						Icon: <FontAwesome name="star" size={16} color={'#feac33'} />,
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
					const ex = /:(.*?):/;
					let data = extraData;
					if (ex.test(extraData)) {
						const match = find(extraData, remoteSubdomain);
						console.log(match);
						data = find(extraData, remoteSubdomain)?.url || extraData;
					}

					console.log('[INFO]: found emoji', data);
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
				case DhaagaJsNotificationType.MENTION: {
					return {
						Icon: <Octicons name="mention" size={24} color="black" />,
						bg: '#1f1f1f',
					};
				}
				default: {
					return {
						Icon: <Octicons name="mention" size={24} color="black" />,
						bg: '#1f1f1f',
					};
				}
			}
		}, [type]);

		return (
			<View style={{ flexDirection: 'row' }}>
				<View
					style={{ width: ICON_SIZE, height: ICON_SIZE, position: 'relative' }}
				>
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
				<View style={{ marginLeft: 12 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						{displayName}
					</Text>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,
							fontSize: 12,
						}}
					>
						{handle}
					</Text>
				</View>
			</View>
		);
	},
);

type InterfaceProps = {
	acct: UserInterface;
	type: DhaagaJsNotificationType;
	extraData?: string;
};

/**
 * Render the Sender interface using UserInterface
 * object (online usage)
 */
export const NotificationSenderInterface = memo(
	({ acct, type, extraData }: InterfaceProps) => {
		const { subdomain } = useActivityPubRestClientContext();

		const id = acct?.getId();
		const acctUrl = acct?.getAccountUrl(subdomain);
		const displayName = acct?.getDisplayName();
		const avatarUrl = acct?.getAvatarUrl();

		const handle = useMemo(() => {
			return ActivitypubHelper.getHandle(acctUrl, subdomain);
		}, [acctUrl]);

		return (
			<NotificationSender
				id={id}
				type={type}
				handle={handle}
				displayName={displayName}
				avatarUrl={avatarUrl}
				extraData={extraData}
			/>
		);
	},
);
