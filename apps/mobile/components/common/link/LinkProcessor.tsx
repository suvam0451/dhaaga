import { Text } from 'react-native';
import { useMemo } from 'react';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

type LinkProcessorProps = {
	url: string;
	displayName: string;
	fontFamily: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
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
			default:
				return APP_FONTS.INTER_600_SEMIBOLD;
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

	const { show, appSession } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			setTextValue: o.profileSessionManager,
			appSession: o.appSession,
		})),
	);

	function onTextPress() {
		if (!acceptTouch) return;
		appSession.cache.setLinkTarget(url, displayName || wwwRemoved);
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
	}

	const { onTextLayout, Result } = useLongLinkTextCollapse(wwwRemoved, 32);
	return (
		<Text
			style={{
				color: theme.complementaryA.a0,
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
