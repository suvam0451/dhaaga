import { useCallback, useMemo } from 'react';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import GlobalMmkvCacheServices from '../../../services/globalMmkvCache.services';
import { Text } from '@rneui/themed';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
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

	const { mmkv, show, setType } = useGlobalState(
		useShallow((o) => ({
			mmkv: o.mmkv,
			show: o.bottomSheet.show,
			setType: o.bottomSheet.setType,
		})),
	);

	const { globalDb } = useGlobalMmkvContext();

	const onTextPress = useCallback(() => {
		if (!acceptTouch) return;

		GlobalMmkvCacheServices.setBottomSheetProp_Link(globalDb, {
			url: url,
			displayName: displayName || wwwRemoved,
		});
		setType(APP_BOTTOM_SHEET_ENUM.LINK);
		setTimeout(() => {
			show();
		}, 200);
	}, []);

	const { onTextLayout, Result } = useLongLinkTextCollapse(wwwRemoved, 32);
	return (
		<Text
			style={{
				color: theme.palette.link,
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
