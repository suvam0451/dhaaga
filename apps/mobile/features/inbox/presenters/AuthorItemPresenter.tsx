import { useAccountManager, useAppTheme } from '#/states/global/hooks';
import type { PostAuthorType, UserObjectType } from '@dhaaga/bridge';
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
import useSheetNavigation from '#/states/navigation/useSheetNavigation';

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
	const { acctManager } = useAccountManager();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { toProfile } = useAppNavigator();
	const { openUserProfileSheet } = useSheetNavigation();

	const desc = LocalizationService.notificationLabel(t, notificationType);

	const Icon = useMemo(() => {
		switch (notificationType) {
			case DriverNotificationType.FAVOURITE: {
				return (
					<AppIcon
						id="heart-outline"
						size={NOTIFICATION_TYPE_ICON_SIZE}
						color={theme.complementary}
					/>
				);
			}
			case DriverNotificationType.REBLOG:
			case DriverNotificationType.RENOTE: {
				return (
					<AppIcon
						id={'sync-outline'}
						color={theme.complementary}
						size={NOTIFICATION_TYPE_ICON_SIZE}
					/>
				);
			}
			case DriverNotificationType.FOLLOW: {
				return (
					<AppIcon
						id="add"
						size={NOTIFICATION_TYPE_ICON_SIZE}
						color={theme.complementary}
					/>
				);
			}
			case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return (
					<AppIcon
						id="checkmark"
						size={NOTIFICATION_TYPE_ICON_SIZE}
						color={theme.complementary}
					/>
				);
			}
			case DriverNotificationType.REACTION: {
				const emoji = acctManager.resolveEmoji(extraData, new Map());

				if (!emoji) {
					return (
						<FontAwesome6
							name="question-circle"
							size={16}
							color={theme.secondary.a40}
						/>
					);
				}

				if (extraData?.length < 5) {
					return <Text>{extraData}</Text>;
				} else {
					return (
						<Image
							source={{ uri: emoji.url }}
							style={{ height: 18, width: 18 }}
						/>
					);
				}
			}
			case DriverNotificationType.REPLY:
				return (
					<AppIcon
						id={'arrow-redo-outline'}
						size={16}
						color={theme.complementary}
					/>
				);
			case DriverNotificationType.MENTION: {
				return (
					<Octicons name="mention" size={16} color={theme.complementary} />
				);
			}
			case DriverNotificationType.STATUS: {
				return (
					<FontAwesome6 name="rss" size={16} color={theme.secondary.a20} />
				);
			}
			case DriverNotificationType.QUOTE:
				return <AppIcon id={'quote'} size={16} color={theme.complementary} />;
			default:
				return <Octicons name="mention" size={24} color="black" />;
		}
	}, [notificationType, extraData, acctManager]);

	function onAvatarPressed() {
		openUserProfileSheet(user.id);
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
			desc={desc}
			onAvatarPressed={onAvatarPressed}
			onUserPressed={onUserPressed}
			onMoreOptionsPressed={onMoreOptionsPressed}
		/>
	);
}

export default AuthorItemPresenter;
