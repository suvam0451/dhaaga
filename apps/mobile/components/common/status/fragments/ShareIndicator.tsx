import { View } from 'react-native';
import { Image } from 'expo-image';
import { AppIcon } from '../../../lib/Icon';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { TextContentView } from '../TextContentView';
import { AppParsedTextNodes } from '../../../../types/parsed-text.types';
import { AppText } from '../../../lib/Text';

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
				<AppIcon id={'retweet'} size={18} color={theme.complementary.a0} />
				<View>
					{/*@ts-ignore-next-line*/}
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
				<TextContentView
					tree={parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={new Map()}
					style={{ marginLeft: 6, flex: 1 }}
				/>
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
