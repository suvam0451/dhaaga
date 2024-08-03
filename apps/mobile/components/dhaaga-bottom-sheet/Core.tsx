import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import WithComposerContext from './modules/post-composer/api/useComposerContext';
import PostCompose from './modules/post-composer/pages/PostCompose';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import {
	BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from './modules/_api/useAppBottomSheet';
import PostPreview from './modules/post-preview/PostPreview';

/**
 * Switches what module will be shown
 * in the bottom sheet
 *
 * @param animStyle will animate the height
 * based on active module
 */
const AppBottomSheet = memo(() => {
	const { animStyle } = useAnimatedHeight();
	const { type } = useAppBottomSheet();

	const Component = useMemo(() => {
		switch (type) {
			case BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
				return <PostPreview />;
			}
			case BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
				return (
					<WithComposerContext>
						<PostCompose />
					</WithComposerContext>
				);
			}
			default: {
				return (
					<WithComposerContext>
						<PostCompose />
					</WithComposerContext>
				);
			}
		}
	}, [type]);

	return (
		<Animated.View style={[styles.rootContainer, animStyle]}>
			{Component}
		</Animated.View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		backgroundColor: '#2C2C2C',
	},
});

export default AppBottomSheet;
