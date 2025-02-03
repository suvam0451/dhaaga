import { Text } from 'react-native';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import TextUtils from '../../../utils/text.utils';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type LinkProcessorProps = {
	url: string;
	displayName: string;
	fontFamily: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
};

function LinkProcessor({ url, displayName, fontFamily }: LinkProcessorProps) {
	const { theme } = useAppTheme();

	const { acceptTouch } = useAppMfmContext();
	const httpsRemoved = url.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, '$2');

	const linkDisplayName = TextUtils.shorten(
		TextUtils.displayNameForLink(displayName),
		28,
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
		appSession.storage.setLinkTarget(url, displayName || wwwRemoved);
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
	}

	const { onTextLayout, Result } = useLongLinkTextCollapse(wwwRemoved, 32);
	return (
		<Text
			style={{
				color: theme.complementaryA.a0,
				fontFamily,
				maxWidth: 128,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				fontSize: 15,
			}}
			onPress={onTextPress}
			onTextLayout={onTextLayout}
			numberOfLines={1}
		>
			{displayName ? linkDisplayName : Result}
		</Text>
	);
}

export default LinkProcessor;
