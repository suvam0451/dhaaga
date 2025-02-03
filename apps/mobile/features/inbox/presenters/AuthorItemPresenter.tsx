import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import {
	useAccountManager,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AppUserObject } from '../../../types/app-user.types';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { useMemo } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text } from 'react-native';
import { Image } from 'expo-image';
import Octicons from '@expo/vector-icons/Octicons';
import { APP_FONT } from '../../../styles/AppTheme';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { AuthorItemView } from '../view/AuthorItemView';
import { LocalizationService } from '../../../services/localization.service';
import { AppIcon } from '../../../components/lib/Icon';

type Props = {
	user: AppUserObject;
	createdAt: Date;
	notificationType: DhaagaJsNotificationType;
	extraData?: string;
};

const NOTIFICATION_TYPE_ICON_SIZE = 18;

function AuthorItemPresenter({
	user,
	createdAt,
	extraData,
	notificationType,
}: Props) {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();
	const { acctManager } = useAccountManager();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const desc = LocalizationService.notificationLabel(t, notificationType);

	const { Icon, bg } = useMemo(() => {
		switch (notificationType) {
			case DhaagaJsNotificationType.FAVOURITE: {
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
			case DhaagaJsNotificationType.REBLOG:
			case DhaagaJsNotificationType.RENOTE: {
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
			case DhaagaJsNotificationType.FOLLOW: {
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
			case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
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
			case DhaagaJsNotificationType.REACTION: {
				console.log('izanagi', extraData);
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
							// @ts-ignore-next-line
							<Image
								source={{ uri: emoji }}
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
	}, [notificationType, extraData, acctManager]);

	function onAvatarPressed() {
		setCtx({
			userId: user.id,
		});
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	function onUserPressed() {}

	function onMoreOptionsPressed() {}

	return (
		<AuthorItemView
			handle={user.handle}
			parsedDisplayName={user.parsedDisplayName}
			emojiMap={user?.calculated?.emojis || new Map()}
			avatarUrl={user.avatarUrl}
			extraData={extraData}
			createdAt={createdAt}
			Icon={Icon}
			bg={bg}
			desc={desc}
			onAvatarPressed={onAvatarPressed}
			onUserPressed={onUserPressed}
			onMoreOptionsPressed={onMoreOptionsPressed}
		/>
	);
}

export default AuthorItemPresenter;
