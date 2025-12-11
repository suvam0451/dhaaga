import { View } from 'react-native';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { useAppTheme } from '#/states/global/hooks';

function TimelineEmptyView() {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.palette.bg,
				paddingTop: 52,
			}}
		>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Timeline Empty'}
				errorDescription={'No posts found. Or, something went wrong.'}
			/>
		</View>
	);
}

export default TimelineEmptyView;
