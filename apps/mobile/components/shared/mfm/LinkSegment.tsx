import { StyleSheet } from 'react-native';
import useLongLinkTextCollapse from '#/states/useLongLinkTextCollapse';
import TextUtils from '#/utils/text.utils';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { NativeTextBold } from '#/ui/NativeText';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type LinkProcessorProps = {
	url: string;
	displayName: string;
};

function LinkSegment({ url, displayName }: LinkProcessorProps) {
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
			$type: 'link-preview',
			linkAttachment: {
				url: url,
				title: displayName || wwwRemoved,
				description: 'N/A',
			},
		});
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
	}

	return (
		<NativeTextBold
			style={[
				styles.text,
				{
					color: theme.complementary,
				},
			]}
			onPress={onTextPress}
			onTextLayout={onTextLayout}
			numberOfLines={1}
		>
			{displayName ? linkDisplayName : Result}
		</NativeTextBold>
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
