import { memo } from 'react';
import { View, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import styles from '../_utils/styles';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import PreviewedPost from './fragments/PreviewedPost';
import PreviewedPostDelete from './fragments/PreviewedPostDelete';
import PreviewedPostEdit from './fragments/PreviewedPostEdit';
import PreviewedPostDone from './fragments/PreviewedPostDone';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

const PostPreview = memo(() => {
	const { forceUpdate, State } = useHookLoadingState();
	const { theme } = useAppTheme();

	return (
		<View style={[styles.bottomSheetContentContainer]}>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						color: theme.textColor.high,
					}}
				>
					Post Published 🎉. Here is a Preview!
				</Text>
			</View>
			<PreviewedPost State={State} />
			<View
				style={{
					marginTop: 16,
					flexDirection: 'row',
				}}
			>
				<PreviewedPostDelete forceUpdate={forceUpdate} State={State} />
				<PreviewedPostEdit State={State} />
				<PreviewedPostDone />
			</View>
		</View>
	);
});

export default PostPreview;
