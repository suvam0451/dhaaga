import { memo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import WithActivitypubStatusContext from '../../../../../states/useStatus';
import StatusItem from '../../../../common/status/StatusItem';
import { Text, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const PreviewPostUnavailable = memo(() => {
	return (
		<View style={{ padding: 16 }}>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 20,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					textAlign: 'center',
					paddingVertical: 32,
				}}
			>
				Nothing to see here
			</Text>
		</View>
	);
});

const PreviewPostAvailable = memo(() => {
	const { PostRef } = useAppBottomSheet();

	return (
		<View style={{ marginTop: 12, marginHorizontal: -8 }}>
			<WithActivitypubStatusContext statusInterface={PostRef.current}>
				<StatusItem />
			</WithActivitypubStatusContext>
		</View>
	);
});

const PreviewedPost = memo(({}: { State: string }) => {
	const { PostRef } = useAppBottomSheet();

	if (PostRef.current === null) return <PreviewPostUnavailable />;
	return <PreviewPostAvailable />;
});

export default PreviewedPost;
