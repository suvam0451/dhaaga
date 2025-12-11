import {
	useAccountManager,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { DriverNotificationType } from '@dhaaga/bridge';
import { useMemo } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text } from 'react-native';
import { Image } from 'expo-image';
import Octicons from '@expo/vector-icons/Octicons';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AuthorItemView } from '../view/AuthorItemView';
import { LocalizationService } from '#/services/localization.service';
import { AppIcon } from '#/components/lib/Icon';
import useAppNavigator from '#/states/useAppNavigator';
import type { UserObjectType, PostAuthorType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	user: PostAuthorType | UserObjectType;
	createdAt: Date;
	notificationType: DriverNotificationType;
	extraData?: string;
	noIcon?: boolean;
};

const NOTIFICATION_TYPE_ICON_SIZE = 18;

function AuthorItemPresenter({
	user,
	createdAt,
	extraData,
	notificationType,
	noIcon,
}: Props) {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();
	const { acctManager } = useAccountManager();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { toProfile } = useAppNavigator();

	const desc = LocalizationService.notificationLabel(t, notificationType);

	const { Icon, bg } = useMemo(() => {
		switch (notificationType) {
			case DriverNotificationType.FAVOURITE: {
				return {
					Icon: (
						<AppIcon
							id="heart"
							size={NOTIFICATION_TYPE_ICON_SIZE}
							color="#ed4999"
						/>
					),
					bg: '#1f1f1f',
				};
			}
			case DriverNotificationType.REBLOG:
			case DriverNotificationType.RENOTE: {
				return {
					Icon: (
						<AppIcon
							id={'sync-outline'}
							color={'white'}
							size={NOTIFICATION_TYPE_ICON_SIZE}
						/>
					),
					bg: '#34d299',
				};
			}
			case DriverNotificationType.FOLLOW: {
				return {
					Icon: (
						<AppIcon
							id="add"
							size={NOTIFICATION_TYPE_ICON_SIZE}
							color="white"
						/>
					),
					bg: '#34aed2',
				};
			}
			case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return {
					Icon: (
						<AppIcon
							id="checkmark"
							size={NOTIFICATION_TYPE_ICON_SIZE}
							color="white"
						/>
					),
					bg: '#34aed2',
				};
			}
			case DriverNotificationType.REACTION: {
				const emoji = acctManager.resolveEmoji(extraData, new Map());

				if (!emoji) {
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

				if (extraData?.length < 5) {
					return {
						Icon: <Text>{extraData}</Text>,
						bg: '#242424',
					};
				} else {
					return {
						Icon: (
							<Image
								source={{ uri: emoji.url }}
								style={{ height: 18, width: 18 }}
							/>
						),
						bg: '#242424',
					};
				}
			}
			case DriverNotificationType.REPLY:
			case DriverNotificationType.MENTION: {
				return {
					Icon: (
						<Octicons name="mention" size={16} color={theme.secondary.a20} />
					),
					bg: 'purple',
				};
			}
			case DriverNotificationType.STATUS: {
				return {
					Icon: (
						<FontAwesome6 name="rss" size={16} color={theme.secondary.a20} />
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
	}, [notificationType, extraData, acctManager]);

	function onAvatarPressed() {
		setCtx({
			userId: user.id,
		});
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	function onUserPressed() {
		toProfile(user.id);
	}

	function onMoreOptionsPressed() {}

	return (
		<AuthorItemView
			handle={user.handle}
			parsedDisplayName={user.parsedDisplayName}
			emojiMap={(user as UserObjectType)?.calculated?.emojis}
			avatarUrl={user.avatarUrl}
			extraData={extraData}
			createdAt={createdAt}
			Icon={noIcon ? null : Icon}
			bg={bg}
			desc={desc}
			onAvatarPressed={onAvatarPressed}
			onUserPressed={onUserPressed}
			onMoreOptionsPressed={onMoreOptionsPressed}
		/>
	);
}

export default AuthorItemPresenter;
