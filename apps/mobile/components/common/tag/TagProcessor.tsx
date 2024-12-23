import { Text } from 'react-native';
import { memo } from 'react';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const HashtagProcessor = memo(function Foo({
	content,
	forwardedKey,
}: {
	content: string;
	forwardedKey: string | number;
}) {
	const { show, appSession, theme } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			appSession: o.appSession,
			theme: o.colorScheme,
		})),
	);

	function onPress() {
		appSession.storage.setTagTarget(content);
		show(APP_BOTTOM_SHEET_ENUM.HASHTAG, true);
	}

	return (
		<Text
			onPress={onPress}
			key={forwardedKey}
			style={{
				color: theme.complementaryA.a0,
				fontFamily: APP_FONTS.INTER_500_MEDIUM,
			}}
		>
			#{content}
		</Text>
	);
});

export default HashtagProcessor;
