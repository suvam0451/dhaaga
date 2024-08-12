import { memo } from 'react';
import { BottomSheetActionButtonContainer } from '../../../../styles/Containers';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../../styles/AppTheme';
import useAppNavigator from '../../../../states/useAppNavigator';
import { useGorhomActionSheetContext } from '../../../../states/useGorhomBottomSheet';

type TagButtonBrowseLocalProps = {
	name: string;
};

/**
 * Press this button to open
 * the local hashtag timeline
 * for selection
 */
const TagButtonBrowseLocal = memo(({ name }: TagButtonBrowseLocalProps) => {
	const { ref } = useGorhomActionSheetContext();

	const { toTag } = useAppNavigator();

	function onNavigate() {
		if (ref?.current) ref.current?.close();
		toTag(name);
	}

	return (
		<BottomSheetActionButtonContainer style={{ marginLeft: 8 }}>
			<TouchableOpacity onPress={onNavigate}>
				<Ionicons
					color={APP_FONT.MONTSERRAT_BODY}
					size={18}
					name={'globe-outline'}
				/>
			</TouchableOpacity>
		</BottomSheetActionButtonContainer>
	);
});

export default TagButtonBrowseLocal;
