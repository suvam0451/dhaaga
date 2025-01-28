import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { AppIcon } from '../../../lib/Icon';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { TextContentView } from '../TextContentView';

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 */
function SharedStatusFragment() {
	const { dto } = useAppStatusItem();
	const { theme } = useAppTheme();

	const boostedBy = dto.postedBy;

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
						source={boostedBy.avatarUrl}
						style={{
							width: 20,
							height: 20,
							borderRadius: 20 / 2,
							marginLeft: 4,
						}}
					/>
				</View>
				<TextContentView
					tree={boostedBy.parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={new Map()}
					style={{ marginLeft: 6 }}
				/>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: theme.secondary.a40,
						fontSize: 13,
						marginLeft: 6,
					}}
				>
					{DatetimeUtil.timeAgo(dto.createdAt)}
				</Text>
			</View>
		</View>
	);
}

export default SharedStatusFragment;
