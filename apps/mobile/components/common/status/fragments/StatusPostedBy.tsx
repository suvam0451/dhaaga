import { memo } from 'react';
import { View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../../styles/AppTheme';
import OriginalPoster from '../../../post-fragments/OriginalPoster';

/**
 * The user
 */
const StatusPostedBy = memo(() => {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				marginBottom: 8,
				position: 'relative',
			}}
		>
			<OriginalPoster />
			<Entypo name="cross" size={28} color={APP_FONT.MONTSERRAT_BODY} />
		</View>
	);
});

export default StatusPostedBy;
