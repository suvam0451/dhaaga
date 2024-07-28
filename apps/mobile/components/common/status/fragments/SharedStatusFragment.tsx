import { memo, useMemo } from 'react';
import { useActivitypubStatusContext } from '../../../../states/useStatus';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import activitypubAdapterService from '../../../../services/activitypub-adapter.service';
import useMfm from '../../../hooks/useMfm';
import { View } from 'react-native';
import { APP_THEME } from '../../../../styles/AppTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import LocalizationService from '../../../../services/localization.services';
import { APP_FONTS } from '../../../../styles/AppFonts';

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 */
const SharedStatusFragment = memo(function Foo() {
	const { status: _status } = useActivitypubStatusContext();
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;

	const userI = useMemo(() => {
		return activitypubAdapterService.adaptUser(_status.getUser(), domain);
	}, [_status]);

	const { content: ParsedDisplayName } = useMfm({
		content: userI?.getDisplayName(),
		remoteSubdomain: userI?.getInstanceUrl(),
		emojiMap: userI?.getEmojiMap(),
		deps: [userI],
		expectedHeight: 32,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	});

	return useMemo(() => {
		if (!_status.isValid()) return <View></View>;

		return (
			<View
				style={{
					backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
					borderTopRightRadius: 8,
					borderTopLeftRadius: 8,
					paddingHorizontal: 12,
					paddingTop: 4,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
				>
					<View>
						<Ionicons color={'#888'} name={'rocket-outline'} size={14} />
					</View>
					<View>
						{/*@ts-ignore-next-line*/}
						<Image
							source={userI.getAvatarUrl()}
							style={{
								width: 20,
								height: 20,
								opacity: 0.75,
								borderRadius: 4,
								marginLeft: 4,
							}}
						/>
					</View>
					<View>
						<Text
							style={{
								color: '#888',
								marginLeft: 4,
								fontSize: 14,
								opacity: 0.6,
							}}
						>
							{ParsedDisplayName}
						</Text>
					</View>
					<View>
						<Text
							style={{
								color: '#888',
								fontSize: 12,
								fontFamily: 'Inter-Bold',
								opacity: 0.6,
							}}
						>
							{' • '}
							{LocalizationService.formatDistanceToNowStrict(
								new Date(_status?.getCreatedAt()),
							)}
						</Text>
					</View>
				</View>
			</View>
		);
	}, [_status, ParsedDisplayName]);
});

export default SharedStatusFragment;
