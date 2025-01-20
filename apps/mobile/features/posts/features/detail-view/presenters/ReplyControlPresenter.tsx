import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { View } from 'react-native';
import { AppText } from '../../../../../components/lib/Text';

function ReplyControlPresenter() {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				flexDirection: 'row',
				paddingHorizontal: 10,
				backgroundColor: theme.background.a40,
				paddingVertical: 10,
			}}
		>
			<AppText.SemiBold
				style={{
					color: theme.secondary.a20,
					fontSize: 18,
				}}
			>
				Replies
			</AppText.SemiBold>
		</View>
	);
}

export default ReplyControlPresenter;
