import { View } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';

type Props = {
	error: any;
};

function TimelineErrorView({ error }: Props) {
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
				errorMessage={'Failed to load Timeline'}
				errorDescription={error?.toString()}
			/>
		</View>
	);
}

export default TimelineErrorView;
