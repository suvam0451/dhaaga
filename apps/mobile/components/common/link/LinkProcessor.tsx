import { useCallback, useMemo } from 'react';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import GlobalMmkvCacheServices from '../../../services/globalMmkvCache.services';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';

type LinkProcessorProps = {
	url: string;
	displayName: string;
	fontFamily: string;
	emphasis: 'high' | 'medium' | 'low';
};

function LinkProcessor({
	url,
	displayName,
	fontFamily,
	emphasis,
}: LinkProcessorProps) {
	const { acceptTouch } = useAppMfmContext();
	const httpsRemoved = url.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, '$2');

	const linkTextFontFamily = useMemo(() => {
		switch (emphasis) {
			case 'high': {
				return APP_FONTS.INTER_600_SEMIBOLD;
			}
			case 'medium': {
				return APP_FONTS.INTER_600_SEMIBOLD;
			}
			case 'low': {
				return APP_FONTS.INTER_600_SEMIBOLD;
			}
		}
	}, [fontFamily, emphasis]);

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
		if (!acceptTouch) return;

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
				color: APP_THEME.LINK_SECONDARY,
				fontFamily: linkTextFontFamily,
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
