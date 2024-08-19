import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../../styles/AppTheme';
import OriginalPoster from '../../../post-fragments/OriginalPoster';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';

type StatusPostedByProps = {
	dto: ActivityPubStatusAppDtoType;
	style?: StyleProp<ViewStyle>;
};

/**
 * The user
 */
const StatusPostedBy = memo(({ dto, style }: StatusPostedByProps) => {
	return (
		<View
			style={[
				{
					flexDirection: 'row',
					marginBottom: 8,
					position: 'relative',
				},
				style,
			]}
		>
			<OriginalPoster dto={dto} />
			<Entypo name="cross" size={28} color={APP_FONT.MONTSERRAT_BODY} />
		</View>
	);
});

export default StatusPostedBy;
