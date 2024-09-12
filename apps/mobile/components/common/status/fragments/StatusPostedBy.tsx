import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import OriginalPoster from '../../../post-fragments/OriginalPoster';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/activitypub-status-dto.service';

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
		</View>
	);
});

export default StatusPostedBy;
