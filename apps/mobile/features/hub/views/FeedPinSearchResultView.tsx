import { Image, useImage } from 'expo-image';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import type { FeedObjectType } from '@dhaaga/bridge';
import { AppIcon } from '#/components/lib/Icon';

type Props = {
	feed: FeedObjectType;
	active: boolean;
	toggle: () => void;
};

function FeedPinSearchResultView({ feed, active, toggle }: Props) {}

export default FeedPinSearchResultView;
