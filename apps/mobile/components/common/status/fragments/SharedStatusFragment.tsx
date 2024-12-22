import { memo } from 'react';
import useMfm from '../../../hooks/useMfm';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { AppIcon } from '../../../lib/Icon';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 */
const SharedStatusFragment = memo(function Foo() {
	const { dto } = useAppStatusItem();

	const boostedBy = dto.postedBy;
	const { content: ParsedDisplayName } = useMfm({
		content: boostedBy.displayName,
		remoteSubdomain: boostedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto],
		expectedHeight: 24,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		numberOfLines: 1,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
	});
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<View
			style={{
				paddingTop: 4,
				marginBottom: 8,
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
							opacity: 0.75,
							borderRadius: 20 / 2,
							marginLeft: 4,
						}}
					/>
				</View>
				<View style={{ marginLeft: 6 }}>{ParsedDisplayName}</View>
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
});

export default SharedStatusFragment;
