import { memo } from 'react';
import { BottomSheetActionButtonContainer } from '../../../../styles/Containers';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../../styles/AppTheme';
import useAppNavigator from '../../../../states/useAppNavigator';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type TagButtonBrowseLocalProps = {
	name: string;
};

/**
 * Press this button to open
 * the local hashtag timeline
 * for selection
 */
const TagButtonBrowseLocal = memo(({ name }: TagButtonBrowseLocalProps) => {
	const { hide } = useGlobalState(
		useShallow((o) => ({
			hide: o.bottomSheet.hide,
		})),
	);

	const { toTag } = useAppNavigator();

	function onNavigate() {
		hide();
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
