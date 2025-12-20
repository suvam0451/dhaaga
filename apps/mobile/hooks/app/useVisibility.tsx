import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

export enum APP_POST_VISIBILITY {
	PUBLIC = 'public', // same in misskey
	UNLISTED = 'home', // Home/Unlisted
	DIRECT = 'direct', // same as "specified" in misskey
	PRIVATE = 'followers', // Private/Followers
}

function useAppVisibility(
	visibility: 'public' | 'home' | 'direct' | 'followers',
) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return useMemo(() => {
		switch (visibility) {
			case 'public': {
				return {
					text: t(`quickPost.visibility.public`),
					icon: (
						<FontAwesome6 name="globe" size={16} color={theme.complementary} />
					),
				};
			}

			case 'home': {
				return {
					text: t(`quickPost.visibility.unlisted`),
					icon: (
						<FontAwesome5 name="home" size={16} color={theme.complementary} />
					),
				};
			}
			case 'direct': {
				return {
					text: t(`quickPost.visibility.private`),
					icon: (
						<FontAwesome5 name="lock" size={16} color={theme.complementary} />
					),
				};
			}
			case 'followers': {
				return {
					text: t(`quickPost.visibility.direct`),
					icon: (
						<Octicons name="mention" size={16} color={theme.complementary} />
					),
				};
			}
			default:
				return {
					icon: (
						<Ionicons
							name="earth-outline"
							size={16}
							color={theme.secondary.a30}
						/>
					),
				};
		}
	}, [t, visibility, theme]);
}

export default useAppVisibility;
