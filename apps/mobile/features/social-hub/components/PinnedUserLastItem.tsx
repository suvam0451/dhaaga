import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';

const PINNED_USER_BOX_SIZE = 64 + (3 + 1.75) * 2;

function PinnedUserLastItem() {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet_Improved();

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER, true);
	}

	return (
		<Pressable
			style={{
				flex: 1,
				marginBottom: 8,
				maxWidth: '25%',
				height: '100%',
			}}
			onPress={onPress}
		>
			<View
				style={{
					width: PINNED_USER_BOX_SIZE,
					alignSelf: 'center',
				}}
			>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						padding: 2,
						borderColor: theme.secondary.a50,
						borderWidth: 2.75,
						opacity: 0.78,
						height: 71.5,
					}}
				>
					<View
						style={{
							width: 48,
							height: 48,
							alignSelf: 'center',
							margin: 'auto',
						}}
					>
						<Ionicons
							name={'add-outline'}
							size={48}
							color={theme.secondary.a50}
						/>
					</View>
				</View>
			</View>
		</Pressable>
	);
}

export default PinnedUserLastItem;
