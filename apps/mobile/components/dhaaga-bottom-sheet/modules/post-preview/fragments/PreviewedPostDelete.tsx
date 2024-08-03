import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';

const PreviewedPostDelete = memo(
	({ forceUpdate }: { forceUpdate: () => void; State: string }) => {
		const { client } = useActivityPubRestClientContext();
		const { PostRef } = useAppBottomSheet();

		async function onDeletePress() {
			if (PostRef.current === null) return;
			const { data, error } = await client.statuses.delete(
				PostRef.current.getId(),
			);

			if (error) {
				console.log(
					'[WARN]: failed to delete post',
					PostRef.current?.getId(),
					error,
				);
				// console.log(PostRef.current.getId(), data, error);
				return;
			}
			PostRef.current = null;
			forceUpdate();
		}

		if (PostRef.current === null) return <View />;
		return (
			<TouchableOpacity
				style={{
					backgroundColor: '#ea6e92',
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 12,
					borderRadius: 8,
					paddingVertical: 6,
					marginLeft: 8,
					maxWidth: 96,
				}}
				onPress={onDeletePress}
			>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					Delete
				</Text>
				<Ionicons
					name="checkmark-done"
					size={20}
					style={{ marginLeft: 8 }}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</TouchableOpacity>
		);
	},
);

export default PreviewedPostDelete;
