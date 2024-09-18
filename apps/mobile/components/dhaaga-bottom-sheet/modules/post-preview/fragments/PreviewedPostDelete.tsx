import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../../lib/Icon';

const PreviewedPostDelete = memo(
	({ forceUpdate }: { forceUpdate: () => void; State: string }) => {
		const { colorScheme } = useAppTheme();
		const { client } = useActivityPubRestClientContext();
		const { PostRef } = useAppBottomSheet();

		async function onDeletePress() {
			if (PostRef.current === null) return;
			const { data, error } = await client.statuses.delete(PostRef.current.id);

			if (error) {
				// handle --> NO_SUCH_NOTE
				console.log(
					'[WARN]: failed to delete post',
					PostRef.current?.id,
					error,
				);
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
					flex: 1,
				}}
				onPress={onDeletePress}
			>
				<Text
					style={{
						color: colorScheme.textColor.high,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					Delete
				</Text>
				<AppIcon
					id={'done'}
					size={20}
					emphasis={'high'}
					containerStyle={{ marginLeft: 8 }}
				/>
			</TouchableOpacity>
		);
	},
);

export default PreviewedPostDelete;
