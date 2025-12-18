import { View } from 'react-native';
import { Image } from 'expo-image';
import { AppIcon } from '../../../lib/Icon';
import { DatetimeUtil } from '#/utils/datetime.utils';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { AppText } from '../../../lib/Text';
import type { AppParsedTextNodes } from '@dhaaga/bridge';
import SantaWaveFromSleigh from '#/skins/christmas/decorators/SantaWaveFromSleigh';
import TextAstRendererView from '#/ui/TextAstRendererView';

type Props = {
	avatarUrl: string;
	parsedDisplayName: AppParsedTextNodes;
	createdAt: Date | string;
};

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 */
function ShareIndicator({ avatarUrl, parsedDisplayName, createdAt }: Props) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				paddingTop: 4,
				marginBottom: appDimensions.timelines.sectionBottomMargin,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-end',
					justifyContent: 'flex-start',
					maxWidth: '100%',
				}}
			>
				<AppIcon id={'retweet'} size={18} color={theme.complementary} />
				<View>
					<Image
						source={avatarUrl}
						style={{
							width: 20,
							height: 20,
							borderRadius: 20 / 2,
							marginLeft: 4,
						}}
					/>
				</View>
				<View style={{ marginLeft: 6, flex: 1, flexDirection: 'row' }}>
					<TextAstRendererView
						tree={parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={new Map()}
					/>
					{/*<View style={{ marginLeft: 6 }}>*/}
					{/*	<SantaWaveFromSleigh size={20} />*/}
					{/*</View>*/}
				</View>
				<AppText.Normal
					style={{
						color: theme.secondary.a20,
						fontSize: 13,
						marginLeft: 6,
						marginRight: 8,
					}}
				>
					{DatetimeUtil.timeAgo(createdAt)}
				</AppText.Normal>
			</View>
		</View>
	);
}

export default ShareIndicator;
