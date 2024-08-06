import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
	type: DhaagaJsNotificationType;
};

export const NotificationDescriptionText = memo(({ type }: Props) => {
	const TextContent = useMemo(() => {
		switch (type) {
			case DhaagaJsNotificationType.FAVOURITE: {
				return 'Liked your post';
			}
			case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return 'Accepted your follow request';
			}
			case DhaagaJsNotificationType.FOLLOW: {
				return 'Now Follows You';
			}
			case DhaagaJsNotificationType.REBLOG:
			case DhaagaJsNotificationType.RENOTE: {
				return 'Boosted your post';
			}
		}
	}, [type]);

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
			<View style={{ width: 26 }}>
				<MaterialIcons
					name="subdirectory-arrow-right"
					size={24}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</View>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					paddingTop: 4,
					// marginTop: 8,
				}}
			>
				{TextContent}
			</Text>
		</View>
	);
});
