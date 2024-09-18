import { memo, useMemo } from 'react';
import useMfm from '../../../hooks/useMfm';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import LocalizationService from '../../../../services/localization.services';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

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
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		numberOfLines: 1,
		emphasis: 'medium',
	});
	const { colorScheme } = useAppTheme();

	return useMemo(() => {
		return (
			<View
				style={{
					backgroundColor: colorScheme.palette.bg,
					borderTopRightRadius: 8,
					borderTopLeftRadius: 8,
					paddingHorizontal: 12,
					paddingTop: 4,
					maxWidth: '100%',
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
						maxWidth: '100%',
					}}
				>
					<View>
						<Ionicons color={'#888'} name={'rocket-outline'} size={14} />
					</View>
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
					<View style={{ flex: 1, marginLeft: 6 }}>{ParsedDisplayName}</View>
					<View>
						<Text
							style={{
								color: colorScheme.textColor.low,
								fontSize: 12,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							}}
						>
							{LocalizationService.formatDistanceToNowStrict(
								new Date(dto.createdAt),
							)}
						</Text>
					</View>
				</View>
			</View>
		);
	}, [dto, ParsedDisplayName]);
});

export default SharedStatusFragment;
