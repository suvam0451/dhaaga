import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

export enum APP_POST_VISIBILITY {
	PUBLIC = 'Public', // same in misskey
	UNLISTED = 'Home', // Home/Unlisted
	DIRECT = 'Direct', // same as "specified" in misskey
	PRIVATE = 'Followers', // Private/Followers
}

function useAppVisibility(visibility: APP_POST_VISIBILITY) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return useMemo(() => {
		switch (visibility) {
			case APP_POST_VISIBILITY.PUBLIC: {
				return {
					text: t(`quickPost.visibility.public`),
					icon: (
						<FontAwesome6
							name="globe"
							size={16}
							color={theme.complementary.a0}
						/>
					),
				};
			}

			case APP_POST_VISIBILITY.UNLISTED: {
				return {
					text: t(`quickPost.visibility.unlisted`),
					icon: (
						<FontAwesome5
							name="home"
							size={16}
							color={theme.complementary.a0}
						/>
					),
				};
			}
			case APP_POST_VISIBILITY.PRIVATE: {
				return {
					text: t(`quickPost.visibility.private`),
					icon: (
						<FontAwesome5
							name="lock"
							size={16}
							color={theme.complementary.a0}
						/>
					),
				};
			}
			case APP_POST_VISIBILITY.DIRECT: {
				return {
					text: t(`quickPost.visibility.direct`),
					icon: (
						<Octicons name="mention" size={16} color={theme.complementary.a0} />
					),
				};
			}
			default:
				return {
					icon: (
						<Ionicons
							name="earth-outline"
							size={16}
							color={theme.textColor.medium}
						/>
					),
				};
		}
	}, [t, visibility, theme]);
}

export default useAppVisibility;
