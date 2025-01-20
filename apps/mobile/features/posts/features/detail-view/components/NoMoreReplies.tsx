import { AppText } from '../../../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';

function NoMoreReplies() {
	return (
		<AppText.Medium
			style={{ textAlign: 'center', marginVertical: 16 }}
			emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
		>
			No more replies
		</AppText.Medium>
	);
}

export default NoMoreReplies;
