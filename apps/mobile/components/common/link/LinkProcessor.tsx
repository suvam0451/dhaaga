import { useCallback } from 'react';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import GlobalMmkvCacheServices from '../../../services/globalMmkvCache.services';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

type LinkProcessorProps = {
	url: string;
	displayName: string;
};

function LinkProcessor({ url, displayName }: LinkProcessorProps) {
	const httpsRemoved = url.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, '$2');

	const displayNameHttpsRemoved = displayName?.replace(
		/(https:\/\/)(.+)/,
		'$2',
	);
	const displayNameWwwRemoved = displayNameHttpsRemoved?.replace(
		/(www\.)(.+)/,
		'$2',
	);

	const { globalDb } = useGlobalMmkvContext();
	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();

	const onTextPress = useCallback(() => {
		GlobalMmkvCacheServices.setBottomSheetProp_Link(globalDb, {
			url: url,
			displayName: displayName || wwwRemoved,
		});
		setBottomSheetType(BOTTOM_SHEET_ENUM.LINK);
		updateRequestId();
		setTimeout(() => {
			setVisible(true);
		}, 200);
	}, []);

	const { onTextLayout, Result } = useLongLinkTextCollapse(wwwRemoved, 32);
	return (
		<Text
			style={{
				color: APP_THEME.LINK,
				fontFamily: 'Inter-Bold',
				maxWidth: 128,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
			onPress={onTextPress}
			onTextLayout={onTextLayout}
		>
			{displayName ? displayNameWwwRemoved : Result}
		</Text>
	);
}

export default LinkProcessor;
