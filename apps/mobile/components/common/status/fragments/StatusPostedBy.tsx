import { memo } from 'react';
import { View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../../styles/AppTheme';
import OriginalPoster from '../../../post-fragments/OriginalPoster';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';

type StatusPostedByProps = {
	dto: ActivityPubStatusAppDtoType;
};

/**
 * The user
 */
const StatusPostedBy = memo(({ dto }: StatusPostedByProps) => {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				marginBottom: 8,
				position: 'relative',
			}}
		>
			<OriginalPoster dto={dto} />
			<Entypo name="cross" size={28} color={APP_FONT.MONTSERRAT_BODY} />
		</View>
	);
});

export default StatusPostedBy;
