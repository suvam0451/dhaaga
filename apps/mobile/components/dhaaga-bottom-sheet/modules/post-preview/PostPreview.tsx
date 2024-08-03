import { memo } from 'react';
import { View, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import styles from '../_utils/styles';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import PreviewedPost from './fragments/PreviewedPost';
import PreviewedPostDelete from './fragments/PreviewedPostDelete';
import PreviewedPostEdit from './fragments/PreviewedPostEdit';
import PreviewedPostDone from './fragments/PreviewedPostDone';

const PostPreview = memo(() => {
	const { forceUpdate, State } = useHookLoadingState();

	return (
		<View style={[styles.bottomSheetContentContainer]}>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<View style={{ maxWidth: 128 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						Post Published.
					</Text>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						Here is a Preview
					</Text>
				</View>
				<View style={{ flexGrow: 1 }} />
				<View style={{ flexDirection: 'row' }}>
					<PreviewedPostEdit State={State} />
					<PreviewedPostDone />
				</View>
			</View>
			<PreviewedPost State={State} />
			<View
				style={{
					marginTop: 16,
					justifyContent: 'flex-end',
					flexDirection: 'row',
				}}
			>
				<PreviewedPostDelete forceUpdate={forceUpdate} State={State} />
			</View>
		</View>
	);
});

export default PostPreview;
