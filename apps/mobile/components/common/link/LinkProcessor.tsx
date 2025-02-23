import { StyleSheet } from 'react-native';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import TextUtils from '../../../utils/text.utils';
import {
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../lib/Text';

type LinkProcessorProps = {
	url: string;
	displayName: string;
	fontFamily: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
};

function LinkProcessor({ url, displayName, fontFamily }: LinkProcessorProps) {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();
	const { acceptTouch } = useAppMfmContext();

	/**
	 * in case displayName is not present,
	 * shorten the link as much as feasible
	 */

	const httpsRemoved = url.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, '$2');
	const { onTextLayout, Result } = useLongLinkTextCollapse(wwwRemoved, 24);

	const linkDisplayName = TextUtils.shorten(
		TextUtils.displayNameForLink(displayName),
		28,
	);

	function onTextPress() {
		if (!acceptTouch) return;
		setCtx({
			linkUrl: url,
			linkLabel: displayName || wwwRemoved,
		});
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
	}

	return (
		<AppText.Medium
			style={[
				styles.text,
				{
					color: theme.complementaryA.a0,
					fontFamily,
				},
			]}
			onPress={onTextPress}
			onTextLayout={onTextLayout}
			numberOfLines={1}
		>
			{displayName ? linkDisplayName : Result}
		</AppText.Medium>
	);
}

export default LinkProcessor;

const styles = StyleSheet.create({
	text: {
		maxWidth: 128,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
});
