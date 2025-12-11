import { StyleSheet } from 'react-native';
import useLongLinkTextCollapse from '#/states/useLongLinkTextCollapse';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import TextUtils from '#/utils/text.utils';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium } from '#/ui/NativeText';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type LinkProcessorProps = {
	url: string;
	displayName: string;
	fontFamily: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
};

function LinkSegment({ url, displayName, fontFamily }: LinkProcessorProps) {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

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
		setCtx({
			linkUrl: url,
			linkLabel: displayName || wwwRemoved,
		});
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
	}

	return (
		<NativeTextMedium
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
		</NativeTextMedium>
	);
}

export default LinkSegment;

const styles = StyleSheet.create({
	text: {
		maxWidth: 128,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
});
