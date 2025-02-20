import { Image, useImage } from 'expo-image';
import { View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import type { FeedObjectType } from '@dhaaga/core';

type Props = {
	feed: FeedObjectType;
};

function FeedPinSearchResultView({ feed }: Props) {
	const img = useImage({ uri: feed.avatar });
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	if (feed.avatar && !img) return <View />;

	return (
		<View
			style={{
				paddingHorizontal: 10,
				flex: 1,
				overflow: 'hidden',
				marginRight: 8,
			}}
		>
			<View style={{ flexDirection: 'row' }}>
				<View>
					{/*@ts-ignore-next-line*/}
					<Image
						source={img}
						style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
					/>
				</View>
				<View style={{ marginLeft: 8, flex: 1 }}>
					<AppText.Medium
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
						}}
					>
						{feed.displayName}
					</AppText.Medium>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						style={{
							fontSize: 13,
							marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
						}}
					>
						{feed.description}
					</AppText.Medium>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
						style={{ fontSize: 13, color: theme.complementary.a0 }}
					>
						{feed.likeCount} {t(`noun.like`, { count: feed.likeCount })} @
						{feed.creator.handle}
					</AppText.Medium>
				</View>
			</View>
		</View>
	);
}

export default FeedPinSearchResultView;
